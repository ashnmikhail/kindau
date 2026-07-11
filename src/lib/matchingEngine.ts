import { prisma } from "@/lib/prisma";

export async function matchJob(jobId: string) {
  //
  // Load Job
  //
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  //
  // Don't continue matching jobs that are already finished
  //
  if (
    job.status === "ASSIGNED" ||
    job.status === "BOOKED" ||
    job.status === "COMPLETED"
  ) {
    return 0;
  }

  //
  // Find professionals who have already received this job
  //
  const previousOffers = await prisma.jobOffer.findMany({
    where: {
      jobId,
    },
    select: {
      professionalId: true,
    },
  });

  const excludedIds = previousOffers.map(
    (offer) => offer.professionalId
  );

  //
  // Find matching professionals
  //
  const professionals = await prisma.professional.findMany({
    where: {
      isActive: true,

      subscriptionStatus: "active",

      id: {
        notIn: excludedIds,
      },

      categories: {
        some: {
          categoryId: job.subcategoryId,
        },
      },

      serviceAreas: {
        some: {
          suburb: {
            equals: job.suburb ?? "",
            mode: "insensitive",
          },
        },
      },
    },

    include: {
      rotationStates: true,
    },
  });

  //
  // Nobody left to offer
  //
  if (professionals.length === 0) {
    await prisma.job.update({
      where: {
        id: job.id,
      },
      data: {
        status: "EXPIRED",
      },
    });

    return 0;
  }

  //
  // Fair rotation
  //
  professionals.sort((a, b) => {
    const aDate =
      a.rotationStates[0]?.lastAssignedAt?.getTime() ?? 0;

    const bDate =
      b.rotationStates[0]?.lastAssignedAt?.getTime() ?? 0;

    return aDate - bDate;
  });

  //
  // Select the next professional
  //
  const selected = professionals[0];

  //
  // Create offer
  //
  await prisma.jobOffer.create({
    data: {
      jobId: job.id,
      professionalId: selected.id,

      status: "PENDING",

      expiresAt: new Date(
        Date.now() + 60 * 60 * 1000 // 1 hour
      ),
    },
  });

  //
  // Update rotation
  //
  const existingRotation =
    await prisma.rotationState.findFirst({
      where: {
        professionalId: selected.id,
        categoryId: job.subcategoryId,
        suburb: job.suburb ?? "",
      },
    });

  if (existingRotation) {
    await prisma.rotationState.update({
      where: {
        id: existingRotation.id,
      },
      data: {
        lastAssignedAt: new Date(),
      },
    });
  } else {
    await prisma.rotationState.create({
      data: {
        professionalId: selected.id,
        categoryId: job.subcategoryId,
        suburb: job.suburb ?? "",
        lastAssignedAt: new Date(),
      },
    });
  }

  //
  // Waiting for professional response
  //
  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: "OFFERED",
    },
  });

  return 1;
}
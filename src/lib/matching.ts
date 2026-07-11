import { prisma } from "@/lib/prisma";

export async function matchJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      subcategory: true,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  const professionals = await prisma.professional.findMany({
    where: {
      isActive: true,

      subscriptionStatus: "active",

      categories: {
        some: {
          categoryId: job.subcategory.categoryId,
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

  if (professionals.length === 0) {
    return 0;
  }

  professionals.sort((a, b) => {
    const aDate =
      a.rotationStates[0]?.lastAssignedAt?.getTime() ?? 0;

    const bDate =
      b.rotationStates[0]?.lastAssignedAt?.getTime() ?? 0;

    return aDate - bDate;
  });

  const chosenProfessional = professionals[0];

  await prisma.jobOffer.create({
    data: {
      jobId: job.id,
      professionalId: chosenProfessional.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await prisma.rotationState.upsert({
    where: {
      professionalId_categoryId_suburb: {
        professionalId: chosenProfessional.id,
        categoryId: job.subcategory.categoryId,
        suburb: job.suburb ?? "",
      },
    },

    update: {
      lastAssignedAt: new Date(),
    },

    create: {
      professionalId: chosenProfessional.id,
      categoryId: job.subcategory.categoryId,
      suburb: job.suburb ?? "",
      lastAssignedAt: new Date(),
    },
  });

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
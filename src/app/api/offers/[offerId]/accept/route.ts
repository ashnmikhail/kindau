import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notify";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      offerId: string;
    }>;
  }
) {
  const { offerId } = await context.params;

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const offer = await prisma.jobOffer.findUnique({
    where: {
      id: offerId,
    },
    include: {
      job: {
        include: {
          user: true,
        },
      },
      professional: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!offer) {
    return new Response("Offer not found", { status: 404 });
  }

  if (offer.professional.userId !== userId) {
    return new Response("Forbidden", { status: 403 });
  }

  if (offer.status !== "PENDING") {
    return new Response("Offer is no longer available.", {
      status: 400,
    });
  }

  //
  // Accept this offer
  //
  await prisma.jobOffer.update({
    where: {
      id: offer.id,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  //
  // Expire every other offer
  //
  await prisma.jobOffer.updateMany({
    where: {
      jobId: offer.jobId,
      id: {
        not: offer.id,
      },
    },
    data: {
      status: "EXPIRED",
    },
  });

  //
  // Assign job
  //
  await prisma.jobAssignment.create({
    data: {
      jobId: offer.jobId,
      professionalId: offer.professionalId,
    },
  });

  //
  // Update job
  //
  await prisma.job.update({
    where: {
      id: offer.jobId,
    },
    data: {
      status: "ASSIGNED",
    },
  });

  //
  // Log activity
  //
  await logActivity(
    offer.jobId,
    "OFFER_ACCEPTED",
    `${offer.professional.name} accepted the offer.`,
    offer.professional.userId
  );

  //
  // Notify customer
  //
  await notify(
    offer.job.userId,
    offer.job.user.email,
    "Offer Accepted",
    `${offer.professional.name} has accepted your job.`,
    "offerAccepted"
  );

  return new Response("Offer accepted", {
    status: 200,
  });
}
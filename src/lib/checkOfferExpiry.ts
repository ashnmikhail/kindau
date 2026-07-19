import { prisma } from "@/lib/prisma";
import { matchJob } from "./matchingEngine";
import { notify } from "@/lib/notify";

export async function checkOfferExpiry(jobId: string) {
  const offer = await prisma.jobOffer.findFirst({
    where: {
      jobId,
      status: "PENDING",
    },
    include: {
      job: {
        include: { user: true },
      },
    },
  });

  if (!offer) return;

  const now = new Date();

  if (offer.expiresAt && offer.expiresAt < now) {
    // 1. Mark expired
    await prisma.jobOffer.update({
      where: { id: offer.id },
      data: { status: "EXPIRED" },
    });

    // 2. Log activity
    await prisma.activity.create({
      data: {
        jobId,
        type: "OFFER_EXPIRED",
        message: "Offer expired without response.",
      },
    });

    // 3. Notify customer
    await notify({
      userId: offer.job.userId,
      email: offer.job.user.email,
      title: "Offer Expired",
      body: "The professional did not respond in time. We are contacting the next available professional.",
      type: "offerExpired",
      template: "offerExpired",
    });

    // 4. Move to next professional
    await matchJob(jobId);
  }
}
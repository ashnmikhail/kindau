import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { matchJob } from "@/lib/matchingEngine";

export async function expireOffer(offerId: string) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: {
      job: {
        include: { user: true },
      },
      professional: true,
    },
  });

  if (!offer) return;

  // Mark expired
  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "EXPIRED" },
  });

  // Log activity
  await logActivity(
    offer.jobId,
    "OFFER_EXPIRED",
    `${offer.professional?.name ?? "Professional"} did not respond in time.`,
    offer.professional?.userId ?? null
  );

  // Move to next professional
  await matchJob(offer.jobId);
}

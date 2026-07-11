import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { runMatchingPipeline } from "@/lib/matchingEngine";

export async function expireOffer(offerId: string) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { job: true },
  });

  if (!offer) return;

  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "EXPIRED" },
  });

  await logActivity(
    offer.jobId,
    "OFFER_EXPIRED",
    "Offer expired without response."
  );

  await runMatchingPipeline(offer.jobId);
}

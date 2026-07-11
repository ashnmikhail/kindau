import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { notify } from "@/lib/notify";
import { matchJob } from "@/lib/matchingEngine";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: { offerId: string } }
) {
  const { offerId } = context.params;

  // FIX: auth() is synchronous
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: {
      job: { include: { user: true } },
      professional: { include: { user: true } },
    },
  });

  if (!offer) return new Response("Offer not found", { status: 404 });

  if (offer.professional.userId !== userId) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.jobOffer.update({
    where: { id: offer.id },
    data: { status: "DECLINED" },
  });

  await logActivity(
    offer.jobId,
    "OFFER_DECLINED",
    `${offer.professional.name} declined the offer.`,
    offer.professional.userId
  );

  await notify(
    offer.job.userId,
    offer.job.user.email,
    "Offer Declined",
    `${offer.professional.name} declined your job. We are contacting the next available professional.`,
    "offerDeclined"
  );

  // FIX: runMatchingPipeline does not exist — use matchJob
  await matchJob(offer.jobId);

  return new Response("Offer declined", { status: 200 });
}

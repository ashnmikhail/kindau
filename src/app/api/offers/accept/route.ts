import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleOfferAcceptance } from "@/lib/rotation";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();

    if (!offerId) {
      return NextResponse.json({ error: "Missing offerId" }, { status: 400 });
    }

    const offer = await prisma.jobOffer.findUnique({
      where: { id: offerId },
      include: {
        job: {
          include: {
            user: true, // customer
          },
        },
        professional: {
          include: {
            user: true, // tradie
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json({ error: "Offer is not active" }, { status: 400 });
    }

    // Accept the offer + assign job
    await handleOfferAcceptance(offerId);

    // 🔥 Notify customer
    await notify(
      offer.job.user.id,
      offer.job.user.email,
      "Offer Accepted",
      "A professional has accepted your job",
      "offerAccepted",
      `/dashboard/jobs/${offer.jobId}`
    );

    // 🔥 Notify professional
    await notify(
      offer.professional.user.id,
      offer.professional.user.email,
      "Offer Accepted",
      "You accepted the job",
      "offerAccepted",
      `/dashboard/jobs/${offer.jobId}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offer acceptance error:", err);
    return NextResponse.json({ error: "Failed to accept offer" }, { status: 500 });
  }
}

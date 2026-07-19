import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleOfferDecline } from "@/lib/rotation";
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

    // Decline the offer
    await handleOfferDecline(offerId);

    // Notify customer
    await notify({
      userId: offer.job.user.id,
      email: offer.job.user.email,
      title: "Offer Declined",
      body: "A professional declined your job",
      type: "offerDeclined",
      template: "offerDeclined",
    });

    // Notify professional
    await notify({
      userId: offer.professional.user.id,
      email: offer.professional.user.email,
      title: "Offer Declined",
      body: "You declined the job",
      type: "offerDeclined",
      template: "offerDeclined",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offer decline error:", err);
    return NextResponse.json({ error: "Failed to decline offer" }, { status: 500 });
  }
}
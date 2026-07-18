import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleOfferDecline } from "@/lib/rotation";

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();

    if (!offerId) {
      return NextResponse.json({ error: "Missing offerId" }, { status: 400 });
    }

    const offer = await prisma.jobOffer.findUnique({ where: { id: offerId } });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json({ error: "Offer is not active" }, { status: 400 });
    }

    await handleOfferDecline(offerId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offer decline error:", err);
    return NextResponse.json({ error: "Failed to decline offer" }, { status: 500 });
  }
}

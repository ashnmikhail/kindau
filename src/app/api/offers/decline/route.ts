// app/api/offers/decline/route.ts

import { NextResponse } from "next/server";
import { handleOfferDecline } from "@/lib/rotation";

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();

    if (!offerId) {
      return NextResponse.json(
        { error: "Missing offerId" },
        { status: 400 }
      );
    }

    await handleOfferDecline(offerId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offer decline error:", err);
    return NextResponse.json(
      { error: "Failed to decline offer" },
      { status: 500 }
    );
  }
}

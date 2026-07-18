// app/api/offers/accept/route.ts

import { NextResponse } from "next/server";
import { handleOfferAcceptance } from "@/lib/rotation";

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();

    if (!offerId) {
      return NextResponse.json(
        { error: "Missing offerId" },
        { status: 400 }
      );
    }

    await handleOfferAcceptance(offerId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Offer acceptance error:", err);
    return NextResponse.json(
      { error: "Failed to accept offer" },
      { status: 500 }
    );
  }
}

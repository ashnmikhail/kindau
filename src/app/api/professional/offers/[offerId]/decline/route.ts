"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/getCurrentProfessional";
import { matchJob } from "@/lib/matchingEngine";

export async function POST(
  req: Request,
  context: { params: { offerId: string } }
) {
  try {
    const { offerId } = context.params;
    const professional = await getCurrentProfessional();

    const offer = await prisma.jobOffer.findUnique({
      where: { id: offerId },
      include: {
        job: {
          include: { user: true },
        },
        professional: true,
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.professionalId !== professional.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json(
        { error: "Offer is no longer available" },
        { status: 400 }
      );
    }

    // Decline
    await prisma.jobOffer.update({
      where: { id: offer.id },
      data: { status: "DECLINED" },
    });

    // Trigger matching engine to send next offer
    await matchJob(offer.jobId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to decline offer" },
      { status: 500 }
    );
  }
}

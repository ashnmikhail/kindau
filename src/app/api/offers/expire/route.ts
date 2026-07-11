import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchJob } from "@/lib/matchingEngine";

export async function POST() {
  const now = new Date();

  const expiredOffers = await prisma.jobOffer.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lt: now,
      },
    },
  });

  let processed = 0;

  for (const offer of expiredOffers) {
    //
    // Mark offer timed out
    //
    await prisma.jobOffer.update({
      where: {
        id: offer.id,
      },
      data: {
        status: "TIMED_OUT",
      },
    });

    //
    // Send job to next tradie
    //
    await matchJob(offer.jobId);

    processed++;
  }

  return NextResponse.json({
    processed,
  });
}
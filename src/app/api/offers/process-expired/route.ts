import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchJob } from "@/lib/matchingEngine";

export async function GET(request: NextRequest) {
  try {
    //
    // Protect cron endpoint
    //
    const auth = request.headers.get("authorization");

    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const now = new Date();

    //
    // Find expired pending offers
    //
    const expiredOffers = await prisma.jobOffer.findMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lte: now,
        },
      },
    });

    for (const offer of expiredOffers) {
      //
      // Expire current offer
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
      // Offer to next professional
      //
      await matchJob(offer.jobId);
    }

    return NextResponse.json({
      success: true,
      processed: expiredOffers.length,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Cron failed.",
      },
      {
        status: 500,
      }
    );
  }
}
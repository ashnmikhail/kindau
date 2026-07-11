import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchJob } from "@/lib/matchingEngine";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      offerId: string;
    }>;
  }
) {
  try {
    const { offerId } = await context.params;

    const offer = await prisma.jobOffer.findUnique({
      where: {
        id: offerId,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found." },
        { status: 404 }
      );
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json(
        { error: "Offer already processed." },
        { status: 400 }
      );
    }

    await prisma.jobOffer.update({
      where: {
        id: offer.id,
      },
      data: {
        status: "DECLINED",
      },
    });

    await matchJob(offer.jobId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to decline offer.",
      },
      {
        status: 500,
      }
    );
  }
}
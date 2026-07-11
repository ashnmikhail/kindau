import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchJob } from "@/lib/matchingEngine";

export async function POST(
  request: Request,
  { params }: { params: { offerId: string } }
) {
  try {
    const offer = await prisma.jobOffer.findUnique({
      where: {
        id: params.offerId,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json(
        { error: "Offer has already been processed." },
        { status: 400 }
      );
    }

    //
    // Mark this offer as declined
    //
    await prisma.jobOffer.update({
      where: {
        id: offer.id,
      },
      data: {
        status: "DECLINED",
      },
    });

    //
    // Log activity
    //
    const professional = await prisma.professional.findUnique({
      where: {
        id: offer.professionalId,
      },
    });

    await prisma.activity.create({
      data: {
        jobId: offer.jobId,
        userId: professional?.userId,
        type: "JOB_DECLINED",
        message: "Professional declined the job offer.",
      },
    });

    //
    // Offer next professional the job
    //
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
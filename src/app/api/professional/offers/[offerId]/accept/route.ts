import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { offerId: string } }
) {
  try {
    //
    // Load Offer
    //
    const offer = await prisma.jobOffer.findUnique({
      where: {
        id: params.offerId,
      },
      include: {
        job: true,
        professional: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        {
          error: "Offer not found.",
        },
        {
          status: 404,
        }
      );
    }

    //
    // Already accepted/declined/etc.
    //
    if (offer.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "This offer is no longer available.",
        },
        {
          status: 400,
        }
      );
    }

    //
    // Mark accepted
    //
    await prisma.jobOffer.update({
      where: {
        id: offer.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    //
    // Expire all remaining offers
    //
    await prisma.jobOffer.updateMany({
      where: {
        jobId: offer.jobId,
        id: {
          not: offer.id,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    //
    // Update Job
    //
    await prisma.job.update({
      where: {
        id: offer.jobId,
      },
      data: {
        status: "ASSIGNED",
      },
    });

    //
    // Assignment
    //
    const existingAssignment =
      await prisma.jobAssignment.findFirst({
        where: {
          jobId: offer.jobId,
          professionalId: offer.professionalId,
        },
      });

    if (!existingAssignment) {
      await prisma.jobAssignment.create({
        data: {
          jobId: offer.jobId,
          professionalId: offer.professionalId,
        },
      });
    }

    //
    // Booking
    //
    const existingBooking =
      await prisma.booking.findUnique({
        where: {
          jobId: offer.jobId,
        },
      });

    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          jobId: offer.jobId,
          customerId: offer.job.userId,
          professionalId: offer.professionalId,
          status: "CONFIRMED",
        },
      });
    }

    //
    // Conversation
    //
    let conversation =
      await prisma.conversation.findUnique({
        where: {
          jobId: offer.jobId,
        },
      });

    if (!conversation) {
      conversation =
        await prisma.conversation.create({
          data: {
            jobId: offer.jobId,
          },
        });
    }

    //
    // Customer participant
    //
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: offer.job.userId,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: offer.job.userId,
      },
    });

    //
    // Professional participant
    //
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: offer.professional.userId,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: offer.professional.userId,
      },
    });

    //
    // Activity Log
    //
    await prisma.activity.create({
      data: {
        jobId: offer.jobId,
        userId: offer.professional.userId,
        type: "JOB_ACCEPTED",
        message: "Professional accepted the job.",
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to accept offer.",
      },
      {
        status: 500,
      }
    );
  }
}
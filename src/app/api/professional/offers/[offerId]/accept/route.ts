"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/getCurrentProfessional";

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
          include: { user: true, subcategory: true },
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

    // Accept the offer
    await prisma.jobOffer.update({
      where: { id: offer.id },
      data: { status: "ACCEPTED" },
    });

    // Expire all other offers
    await prisma.jobOffer.updateMany({
      where: {
        jobId: offer.jobId,
        id: { not: offer.id },
      },
      data: { status: "EXPIRED" },
    });

    // Assign job
    await prisma.job.update({
      where: { id: offer.jobId },
      data: { status: "ASSIGNED" },
    });

    // Create assignment if missing
    await prisma.jobAssignment.upsert({
      where: {
        jobId_professionalId: {
          jobId: offer.jobId,
          professionalId: professional.id,
        },
      },
      update: {},
      create: {
        jobId: offer.jobId,
        professionalId: professional.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to accept offer" },
      { status: 500 }
    );
  }
}

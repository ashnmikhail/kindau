import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/getCurrentProfessional";

export async function GET() {
  try {
    const professional = await getCurrentProfessional();

    const offers = await prisma.jobOffer.findMany({
      where: {
        professionalId: professional.id,
        status: "PENDING",
      },
      include: {
        job: {
          include: {
            subcategory: true,
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activeJobs = await prisma.job.findMany({
      where: {
        assignments: {
          some: { professionalId: professional.id },
        },
        status: {
          in: ["ASSIGNED", "CONTACT_PENDING", "IN_PROGRESS"],
        },
      },
      include: {
        user: true,
        subcategory: true,
        bookings: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const completedJobs = await prisma.job.findMany({
      where: {
        assignments: {
          some: { professionalId: professional.id },
        },
        status: "COMPLETED",
      },
      include: {
        user: true,
        subcategory: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    const subscription = {
      status: professional.subscriptionStatus,
      renewal: professional.subscriptionCurrentPeriodEnd,
    };

    return NextResponse.json({
      professional,
      offers,
      activeJobs,
      completedJobs,
      subscription,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load dashboard" },
      { status: 500 }
    );
  }
}

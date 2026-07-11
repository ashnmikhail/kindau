"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/getCurrentProfessional";

export async function POST(
  req: Request,
  context: { params: { jobId: string } }
) {
  try {
    const { jobId } = context.params;
    const professional = await getCurrentProfessional();

    // Ensure job belongs to this professional
    const assignment = await prisma.jobAssignment.findFirst({
      where: {
        jobId,
        professionalId: professional.id,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "IN_PROGRESS" },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        jobId,
        userId: professional.userId,
        type: "JOB_STARTED",
        message: "Professional started the job.",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to start job" },
      { status: 500 }
    );
  }
}

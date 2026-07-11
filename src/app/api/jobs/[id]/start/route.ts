import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json(
      { error: "Job not found" },
      { status: 404 }
    );
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "IN_PROGRESS",
    },
  });

  await prisma.activity.create({
    data: {
      jobId,
      type: "JOB_STARTED",
      message: "Professional started the job.",
    },
  });

  return NextResponse.json({
    success: true,
  });
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Turned params into a Promise
) {
  const { id: jobId } = await params; // 2. Await the params object here

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "ASSIGNED") {
    return NextResponse.json(
      { error: "Job is not assigned yet" },
      { status: 400 }
    );
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CONTACT_PENDING" },
  });

  return NextResponse.json({ success: true });
}
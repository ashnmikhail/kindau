import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { jobId, rating, comment } = body;

  if (!jobId || !rating) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Fetch job to ensure customer owns it
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { user: true, assignments: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Ensure logged-in user is the job's customer
  if (job.user.clerkId !== userId) {
    return NextResponse.json(
      { error: "You are not the customer for this job" },
      { status: 403 }
    );
  }

  // Ensure job is completed
  if (job.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot review a job that is not completed" },
      { status: 400 }
    );
  }

  // Ensure job has an assigned professional
  const assignment = job.assignments?.[0];
  if (!assignment) {
    return NextResponse.json(
      { error: "Job has no assigned professional" },
      { status: 400 }
    );
  }

  // Ensure customer has not already reviewed
  const existingReview = await prisma.review.findFirst({
    where: { jobId },
  });

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this job" },
      { status: 400 }
    );
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      jobId,
      customerId: job.userId,
      professionalId: assignment.professionalId,
      rating,
      comment: comment ?? "",
    },
  });

  return NextResponse.json({ success: true, review });
}

// app/api/jobs/create/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runRotationForJob } from "@/lib/rotation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerId,
      categoryId,
      subcategoryId,
      description,
      postcode,
      price,
    } = body;

    if (!customerId || !categoryId || !subcategoryId || !postcode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. CREATE JOB
    const job = await prisma.job.create({
      data: {
        customerId,
        categoryId,
        subcategoryId,
        description,
        postcode,
        price,
        status: "PENDING",
      },
    });

    // 2. LOG ACTIVITY
    await prisma.activity.create({
      data: {
        jobId: job.id,
        type: "JOB_CREATED",
        message: "Customer created a new job",
      },
    });

    // 3. TRIGGER ROTATION ENGINE
    runRotationForJob(job.id);

    // 4. RETURN JOB
    return NextResponse.json({ job });
  } catch (err) {
    console.error("Job creation error:", err);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

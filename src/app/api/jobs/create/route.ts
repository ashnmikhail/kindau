import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runRotationForJob } from "@/lib/rotation";
import { logActivity } from "@/lib/activity";
import { JobStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      subcategoryId,
      description,
      suburb,
      postcode,
      price,
      requestedDay,
      startTime,
      endTime,
    } = body;

    // REQUIRED FIELDS CHECK
    if (
      !userId ||
      !subcategoryId ||
      !postcode ||
      requestedDay === undefined ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. CREATE JOB
    const job = await prisma.job.create({
      data: {
        userId,
        subcategoryId,
        description,
        suburb,
        postcode,
        price,
        status: JobStatus.PENDING,

        // ⭐ NEW SCHEDULING FIELDS
        requestedDay,
        startTime,
        endTime,
      },
    });

    // 2. LOG ACTIVITY
    await logActivity(
      job.id,
      "JOB_CREATED",
      "Customer created a new job",
      userId
    );

    // 3. TRIGGER ROTATION ENGINE
    await runRotationForJob(job.id);

    return NextResponse.json({ job });
  } catch (err) {
    console.error("Job creation error:", err);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

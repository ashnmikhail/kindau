import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { matchJob } from "@/lib/matching";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const job = await prisma.job.create({
      data: {
        userId: user.id,

        subcategoryId: body.subcategoryId,

        description: body.description,

        suburb: body.suburb,

        postcode: body.postcode,

        status: "MATCHING",
      },
    });

    const matchedCount = await matchJob(job.id);

    return NextResponse.json({
      success: true,
      matchedProfessionals: matchedCount,
      job,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create job.",
      },
      {
        status: 500,
      }
    );
  }
}
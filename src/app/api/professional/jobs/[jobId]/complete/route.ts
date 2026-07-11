"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ job });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to complete job" },
      { status: 500 }
    );
  }
}

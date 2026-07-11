"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfessional } from "@/lib/getCurrentProfessional";

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();
    const professional = await getCurrentProfessional();

    // Load job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { user: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Create or load conversation
    const conversation = await prisma.conversation.upsert({
      where: { jobId },
      update: {},
      create: { jobId },
    });

    // Ensure participants exist
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: job.userId,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: job.userId,
      },
    });

    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: professional.userId,
        },
      },
      update: {},
      create: {
        conversationId: conversation.id,
        userId: professional.userId,
      },
    });

    return NextResponse.json({ conversationId: conversation.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to start conversation" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Update the type signature to accept a Promise for params
export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  // Await the params to resolve the jobId
  const { jobId } = await params;

  // Try to find existing conversation
  let convo = await prisma.conversation.findUnique({
    where: { jobId },
  });

  // If none exists → create one
  if (!convo) {
    convo = await prisma.conversation.create({
      data: { jobId },
    });
  }

  return NextResponse.json(convo);
}
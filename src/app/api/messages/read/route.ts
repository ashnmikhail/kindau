import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { conversationId, userId } = await req.json();

  // FIX: resolve actual DB user
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ ok: false });
  }

  await prisma.conversationParticipant.upsert({
    where: {
      conversationId_userId: {
        conversationId,
        userId: dbUser.id, // FIXED
      },
    },
    update: { lastReadAt: new Date() },
    create: {
      conversationId,
      userId: dbUser.id, // FIXED
      lastReadAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}

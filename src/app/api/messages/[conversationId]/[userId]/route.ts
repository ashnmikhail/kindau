import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    conversationId: string;
    userId: string; // Clerk userId
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { conversationId, userId } = await params;

  // FIX: resolve actual DB user
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ unread: 0 });
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: dbUser.id, // FIXED
      },
    },
  });

  const lastReadAt = participant?.lastReadAt ?? new Date(0);

  const unread = await prisma.message.count({
    where: {
      conversationId,
      senderId: {
        not: dbUser.id, // FIXED
      },
      createdAt: {
        gt: lastReadAt,
      },
    },
  });

  return NextResponse.json({ unread });
}

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ conversationId: string }> } // 1. Turned params into a Promise
) {
  const { conversationId } = await context.params; // 2. Await the params here
  const { userId } = await auth();

  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation)
    return Response.json({ error: "Conversation not found" }, { status: 404 });

  const participant = conversation.participants.find(
    (p) => p.userId === userId
  );

  if (!participant)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  // Update participant lastReadAt
  await prisma.conversationParticipant.update({
    where: { id: participant.id },
    data: { lastReadAt: new Date() },
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  });

  return Response.json({ success: true });
}
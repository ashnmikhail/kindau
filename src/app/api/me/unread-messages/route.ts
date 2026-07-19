import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await prisma.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true, lastReadAt: true },
  });

  let unread = 0;

  for (const c of conversations) {
    const count = await prisma.message.count({
      where: {
        conversationId: c.conversationId,
        senderId: { not: userId },
        createdAt: { gt: c.lastReadAt },
      },
    });

    unread += count;
  }

  return Response.json({ unread });
}

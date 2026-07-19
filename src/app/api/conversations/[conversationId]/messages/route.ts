import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  context: { params: { conversationId: string } }
) {
  const { conversationId } = context.params;
  const { userId } = await auth();

  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { body, fileUrl, fileName, type } = await req.json();

  const allowedTypes = ["text", "image", "file"];
  if (type && !allowedTypes.includes(type)) {
    return Response.json({ error: "Invalid message type" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation)
    return Response.json({ error: "Conversation not found" }, { status: 404 });

  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId
  );

  if (!isParticipant)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: userId,
      body: body ?? null,
      type: type ?? "text",
      fileUrl: fileUrl ?? null,
      fileName: fileName ?? null,
      read: true, // sender's own message is always read
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return Response.json({ success: true, message });
}

export async function GET(
  req: Request,
  context: { params: { conversationId: string } }
) {
  const { conversationId } = context.params;
  const { userId } = await auth();

  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation)
    return Response.json({ error: "Conversation not found" }, { status: 404 });

  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId
  );

  if (!isParticipant)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: { sender: true },
  });

  return Response.json({ messages });
}

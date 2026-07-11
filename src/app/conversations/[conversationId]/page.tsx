import { prisma } from "@/lib/prisma";
import Chat from "./Chat";

export default async function Page(
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      user: true,
      professional: true,
    },
  });

  return (
    <Chat
      conversationId={conversationId}
      conversation={conversation}
    />
  );
}

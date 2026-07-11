import { prisma } from "@/lib/prisma";
import Chat from "./Chat";

export default async function Page(
  context: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await context.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      job: {
        include: {
          user: true, // customer
          assignments: {
            include: {
              professional: true, // assigned tradie
            },
          },
        },
      },
      participants: {
        include: {
          user: true, // users in the conversation
        },
      },
      messages: {
        include: {
          sender: true, // sender details
        },
      },
    },
  });

  return (
    <Chat
      conversationId={conversationId}
      conversation={conversation}
    />
  );
}

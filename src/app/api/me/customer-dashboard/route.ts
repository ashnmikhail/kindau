import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Active job (any job not completed/cancelled/expired)
  const activeJob = await prisma.job.findFirst({
    where: {
      customerId: userId,
      status: { in: ["OPEN", "ASSIGNED", "CONTACT_PENDING", "BOOKED"] },
    },
    include: {
      professional: true,
      booking: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Upcoming booking (if exists)
  let upcomingBooking = null;
  if (activeJob?.bookingId) {
    upcomingBooking = await prisma.booking.findUnique({
      where: { id: activeJob.bookingId },
      include: {
        professional: true,
        job: true,
      },
    });
  }

  // 3. Pending actions
  const pendingActions = await prisma.booking.findMany({
    where: {
      customerId: userId,
      status: { in: ["PENDING_CUSTOMER"] },
    },
    include: {
      job: true,
      professional: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Conversations + unread messages
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      job: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      participants: true,
    },
  });

  const unread = await Promise.all(
    conversations.map(async (c) => {
      const participant = c.participants.find((p) => p.userId === userId);
      if (!participant) return { conversationId: c.id, unread: 0 };

      const count = await prisma.message.count({
        where: {
          conversationId: c.id,
          senderId: { not: userId },
          createdAt: { gt: participant.lastReadAt },
        },
      });

      return { conversationId: c.id, unread: count };
    })
  );

  // 5. Past jobs
  const pastJobs = await prisma.job.findMany({
    where: {
      customerId: userId,
      status: { in: ["COMPLETED", "CANCELLED", "EXPIRED"] },
    },
    include: {
      professional: true,
      booking: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({
    activeJob,
    upcomingBooking,
    pendingActions,
    conversations,
    unread,
    pastJobs,
  });
}

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { JobStatus, BookingStatus } from "@prisma/client";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Active job (any job not completed/cancelled/expired)
  const activeJob = await prisma.job.findFirst({
    where: {
      userId: userId, 
      status: { 
        in: [
          JobStatus.PENDING,
          JobStatus.MATCHING,
          JobStatus.OFFERED,
          JobStatus.ASSIGNED, 
          JobStatus.CONTACT_PENDING, 
          JobStatus.BOOKED
        ] 
      },
    },
    include: {
      professional: true,
      bookings: true, // FIXED: Pluralized to match your schema's "bookings Booking?" relation
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Upcoming booking (if exists)
  let upcomingBooking = null;
  // Note: If you run into types complaining about activeJob.bookingId, 
  // you might need to reference activeJob.bookings?.id depending on how your one-to-one is resolved.
  if (activeJob?.bookings) {
    upcomingBooking = await prisma.booking.findUnique({
      where: { id: activeJob.bookings.id },
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
      status: { in: [BookingStatus.PENDING_CUSTOMER] },
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
      userId: userId,
      status: { 
        in: [
          JobStatus.COMPLETED, 
          JobStatus.CANCELLED, 
          JobStatus.EXPIRED
        ] 
      },
    },
    include: {
      professional: true,
      bookings: true, // FIXED: Pluralized to match schema
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
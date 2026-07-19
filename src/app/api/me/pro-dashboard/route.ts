import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Load professional record
  const professional = await prisma.professional.findUnique({
    where: { userId },
  });

  if (!professional)
    return Response.json({ error: "Not a professional" }, { status: 403 });

  const proId = professional.id;

  // Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 1. Today's bookings
  const todaysBookings = await prisma.booking.findMany({
    where: {
      professionalId: proId,
      status: "CONFIRMED",
      startTime: { gte: today, lt: tomorrow },
    },
    include: { job: true, customer: true },
    orderBy: { startTime: "asc" },
  });

  // 2. Upcoming bookings
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      professionalId: proId,
      status: "CONFIRMED",
      startTime: { gt: tomorrow },
    },
    include: { job: true, customer: true },
    orderBy: { startTime: "asc" },
  });

  // 3. Pending customer actions
  const pendingCustomer = await prisma.booking.findMany({
    where: {
      professionalId: proId,
      status: "PENDING_CUSTOMER",
    },
    include: { job: true, customer: true },
    orderBy: { createdAt: "desc" },
  });

  // 4. Assigned jobs (not yet booked)
  const assignedJobs = await prisma.job.findMany({
    where: {
      professionalId: proId,
      status: "ASSIGNED",
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  // 5. Completed jobs
  const completedJobs = await prisma.job.findMany({
    where: {
      professionalId: proId,
      status: "COMPLETED",
    },
    include: { customer: true },
    orderBy: { updatedAt: "desc" },
  });

  // 6. Conversations + unread messages
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

  // Unread count per conversation
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

  return Response.json({
    todaysBookings,
    upcomingBookings,
    pendingCustomer,
    assignedJobs,
    completedJobs,
    conversations,
    unread,
  });
}

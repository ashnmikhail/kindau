import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  const { userId } = await auth();
  if (!userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = params;

  // Load booking + job + professional
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      job: true,
      professional: true,
      customer: true,
    },
  });

  if (!booking)
    return Response.json({ error: "Booking not found" }, { status: 404 });

  // Ensure the logged-in user is the customer
  if (booking.customerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  // Ensure booking is awaiting customer confirmation
  if (booking.status !== "PENDING_CUSTOMER")
    return Response.json(
      { error: "Booking is not awaiting customer confirmation" },
      { status: 400 }
    );

  // Update booking → CONFIRMED
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  // Update job → BOOKED
  await prisma.job.update({
    where: { id: booking.jobId },
    data: { status: "BOOKED" },
  });

  // Create conversation if not already created
  const existingConversation = await prisma.conversation.findUnique({
    where: { jobId: booking.jobId },
  });

  if (!existingConversation) {
    await prisma.conversation.create({
      data: {
        jobId: booking.jobId,
        participants: {
          create: [
            { userId: booking.customerId },
            { userId: booking.professional.userId },
          ],
        },
      },
    });
  }

  return Response.json({ success: true });
}

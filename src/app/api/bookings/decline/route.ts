import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { bookingId } = await req.json()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { job: true },
  })

  if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 })

  if (booking.job.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  // Update booking status
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" }, // Fixed: Changed "DECLINED" to "CANCELLED"
  })

  // Update job status
  await prisma.job.update({
    where: { id: booking.jobId },
    data: { status: "MATCHING" }, // restart matching (This is a valid JobStatus!)
  })

  return Response.json({ success: true })
}
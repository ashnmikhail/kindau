import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId, scheduledAt } = await req.json()

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { professional: true },
  })

  if (!job) return Response.json({ error: "Job not found" }, { status: 404 })

  // Ensure professional owns this job
  if (job.professional?.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      jobId,
      scheduledAt: new Date(scheduledAt),
      status: "PENDING_CUSTOMER",
    },
  })

  // Update job status
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "AWAITING_CUSTOMER_CONFIRMATION" },
  })

  return Response.json({ success: true, booking })
}

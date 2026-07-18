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

  // Ensure professional owns this job and exists
  if (!job.professional || job.professional.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      scheduledDate: new Date(scheduledAt), 
      status: "PENDING_CUSTOMER",
      // Connect the required relationships using IDs
      job: {
        connect: { id: jobId }
      },
      customer: {
        connect: { id: job.userId } // The user who created the job is the customer
      },
      professional: {
        connect: { id: job.professional.id } // The professional assigned to the job
      }
    },
  })

  // Update job status
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CONTACT_PENDING" }, 
  })

  return Response.json({ success: true, booking })
}
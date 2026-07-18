import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await req.json()

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { professional: true },
  })

  if (!job) return Response.json({ error: "Job not found" }, { status: 404 })

  // Ensure tradie owns this job
  if (!job.professional || job.professional.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  if (job.status !== "IN_PROGRESS")
    return Response.json({ error: "Job not in progress" }, { status: 400 })

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "COMPLETED" },
  })

  await prisma.activity.create({
    data: {
      jobId,
      type: "JOB_COMPLETED",
      message: "Professional completed the job",
      userId,
    },
  })

  return Response.json({ success: true })
}

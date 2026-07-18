import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const jobId = params.id

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      professional: {
        select: {
          userId: true,
        },
      },
      booking: true,
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 20,
          },
        },
      },
      subcategory: {
        select: {
          name: true,
          category: { select: { name: true } },
        },
      },
    },
  })

  if (!job) return Response.json({ error: "Job not found" }, { status: 404 })

  // Ensure professional owns this job
  if (job.professional?.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  return Response.json(job)
}

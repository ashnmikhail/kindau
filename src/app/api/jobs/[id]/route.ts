import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // In Next.js 15, Clerk's auth() must be awaited
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  // Await the params Promise to get the ID
  const { id: jobId } = await context.params

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

  if (job.professional?.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  return Response.json(job)
}
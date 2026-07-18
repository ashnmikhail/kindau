import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id: jobId } = await context.params

  const professionalProfile = await prisma.professional.findUnique({
    where: { userId },
  })

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
      bookings: true, 
      assignments: true, 
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

  const isBooked = job.bookings?.professionalId === professionalProfile?.id
  const isAssigned = job.assignments.some(
    (assignment) => assignment.professionalId === professionalProfile?.id
  )

  if (!isBooked && !isAssigned) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const responseData = {
    ...job,
    professional: professionalProfile ? { userId: professionalProfile.userId } : null,
  }

  return Response.json(responseData)
}
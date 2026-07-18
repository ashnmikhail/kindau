import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  // Await the asynchronous auth() call for Next.js 15 compatibility
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const offers = await prisma.jobOffer.findMany({
    where: {
      professional: { userId },
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    include: {
      job: {
        select: {
          id: true,
          suburb: true,
          description: true,
          subcategory: {
            select: { name: true, category: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(offers)
}
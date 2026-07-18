import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  // Await the asynchronous auth() call for Next.js 15 compatibility
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { offerId } = await req.json()

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { job: true, professional: true },
  })

  if (!offer) return Response.json({ error: "Offer not found" }, { status: 404 })

  if (offer.professional.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  if (offer.expiresAt < new Date())
    return Response.json({ error: "Offer expired" }, { status: 400 })

  // Mark offer accepted
  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "ACCEPTED" },
  })

  // Assign job
  await prisma.job.update({
    where: { id: offer.jobId },
    data: { status: "ASSIGNED", professionalId: offer.professionalId },
  })

  return Response.json({ success: true })
}
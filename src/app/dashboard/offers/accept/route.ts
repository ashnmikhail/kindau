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

  // 1. Mark the specific offer as accepted
  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "ACCEPTED" },
  })

  // 2. Update the main job status to ASSIGNED
  await prisma.job.update({
    where: { id: offer.jobId },
    data: { status: "ASSIGNED" },
  })

  // 3. Create the assignment linking the job to the professional
  // Using upsert prevents errors if the record somehow already exists
  await prisma.jobAssignment.upsert({
    where: {
      jobId_professionalId: {
        jobId: offer.jobId,
        professionalId: offer.professionalId,
      },
    },
    create: {
      jobId: offer.jobId,
      professionalId: offer.professionalId,
    },
    update: {},
  })

  return Response.json({ success: true })
}
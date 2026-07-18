import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { offerId } = await req.json()

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { professional: true },
  })

  if (!offer) return Response.json({ error: "Offer not found" }, { status: 404 })

  if (offer.professional.userId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "DECLINED" },
  })

  return Response.json({ success: true })
}

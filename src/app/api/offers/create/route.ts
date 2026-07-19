import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notify } from "@/lib/notify"
import { logActivity } from "@/lib/activity"

export async function POST(req: Request) {
  try {
    const { jobId, professionalId } = await req.json()

    if (!jobId || !professionalId) {
      return NextResponse.json({ error: "Missing jobId or professionalId" }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { user: true },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: { user: true },
    })

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 })
    }

    const offer = await prisma.jobOffer.create({
      data: {
        jobId,
        professionalId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    await logActivity(jobId, "OFFER_SENT", `Offer sent to professional ${professionalId}`, professional.userId)

    // Notify professional
    await notify({
      userId: professional.user.id,
      email: professional.user.email,
      title: "New Job Offer",
      body: `You have a new job offer`,
      type: "newOffer",
      template: "newOffer",
    })

    return NextResponse.json({ ok: true, offer })
  } catch (err) {
    console.error("Offer creation error:", err)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
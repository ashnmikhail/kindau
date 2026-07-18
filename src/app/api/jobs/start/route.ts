import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notify } from "@/lib/notify"
import { logActivity } from "@/lib/activity"
import { JobStatus } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        user: true, // customer
        assignments: {
          include: {
            professional: {
              include: { user: true },
            },
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const assignment = job.assignments[0]
    if (!assignment) {
      return NextResponse.json({ error: "Job has no assigned professional" }, { status: 400 })
    }

    const professional = assignment.professional

    // ⭐ SECURITY FIX: Ensure logged-in user is the assigned professional
    if (professional.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS },
    })

    // Log activity
    await logActivity(jobId, "JOB_STARTED", "Job started", professional.userId)

    // Notify customer
    await notify(
      job.user.id,
      job.user.email,
      "Job Started",
      "Your professional has started the job",
      "jobStarted",
      `/dashboard/jobs/${jobId}`
    )

    // Notify professional
    await notify(
      professional.user.id,
      professional.user.email,
      "Job Started",
      "You have started the job",
      "jobStarted",
      `/dashboard/jobs/${jobId}`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Job start error:", err)
    return NextResponse.json({ error: "Failed to start job" }, { status: 500 })
  }
}

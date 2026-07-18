import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notify } from "@/lib/notify"
import { logActivity } from "@/lib/activity"
import { JobStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
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

    // Update job status
    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.COMPLETED },
    })

    // Log activity
    await logActivity(jobId, "JOB_COMPLETED", "Job completed", professional.userId)

    // Notify customer
    await notify(
      job.user.id,
      job.user.email,
      "Job Completed",
      "Your job has been completed",
      "jobCompleted",
      `/dashboard/jobs/${jobId}`
    )

    // Notify professional
    await notify(
      professional.user.id,
      professional.user.email,
      "Job Completed",
      "You have completed the job",
      "jobCompleted",
      `/dashboard/jobs/${jobId}`
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Job completion error:", err)
    return NextResponse.json({ error: "Failed to complete job" }, { status: 500 })
  }
}

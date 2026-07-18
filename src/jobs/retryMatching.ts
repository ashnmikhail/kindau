import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"
import { JobStatus } from "@prisma/client"
import { notify } from "@/lib/notify"

export async function retryMatching(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      retryCount: true,
      maxRetries: true,
      suburb: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      subcategory: {
        select: {
          categoryId: true,
        },
      },
    },
  })

  if (!job) return

  // Stop if max retries reached
  if (job.retryCount >= job.maxRetries) {
    await logActivity(job.id, "MATCHING_FAILED", "Max retries reached", null)

    await notify(
      job.user.id,
      job.user.email,
      "Matching Failed",
      "We could not find any available professionals after multiple retries.",
      "jobRetry",
      `/dashboard/jobs/${job.id}`
    )

    return
  }

  // Increment retry count
  await prisma.job.update({
    where: { id: job.id },
    data: {
      retryCount: { increment: 1 },
      lastRetryAt: new Date(),
      status: JobStatus.MATCHING,
    },
  })

  const retryNumber = job.retryCount + 1

  await logActivity(
    job.id,
    "MATCHING_RETRY",
    `Retry #${retryNumber} started`,
    null
  )

  // Notify customer
  await notify(
    job.user.id,
    job.user.email,
    "Retrying Job",
    `Retry #${retryNumber} started — we're trying again to find a professional.`,
    "jobRetry",
    `/dashboard/jobs/${job.id}`
  )

  // 1. Find new professionals
  const professionals = await prisma.professional.findMany({
    where: {
      categories: {
        some: { categoryId: job.subcategory.categoryId },
      },
      serviceAreas: job.suburb
        ? { some: { suburb: job.suburb } }
        : undefined,
      isActive: true,
    },
    take: 10,
  })

  if (professionals.length === 0) {
    await logActivity(job.id, "MATCHING_FAILED", "No professionals available", null)

    await notify(
      job.user.id,
      job.user.email,
      "No Professionals Available",
      "We couldn't find any available professionals in your area. We'll try again soon.",
      "jobRetry",
      `/dashboard/jobs/${job.id}`
    )

    return
  }

  // 2. Create new offers
  for (const pro of professionals) {
    await prisma.jobOffer.create({
      data: {
        jobId: job.id,
        professionalId: pro.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    await logActivity(
      job.id,
      "OFFER_SENT",
      `Retry offer sent to professional ${pro.id}`,
      pro.userId
    )

    await notify(
      pro.userId,
      pro.email,
      "New Job Offer",
      `A job has been retried and you have received a new offer.`,
      "newOffer",
      `/dashboard/offers`
    )
  }

  return { retry: retryNumber, offers: professionals.length }
}

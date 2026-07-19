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

    await notify({
      userId: job.user.id,
      email: job.user.email,
      title: "Matching Failed",
      body: "We could not find any available professionals after multiple retries.",
      type: "jobRetry",
      template: "jobRetry",
    })

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
  await notify({
    userId: job.user.id,
    email: job.user.email,
    title: "Retrying Job",
    body: `Retry #${retryNumber} started — we're trying again to find a professional.`,
    type: "jobRetry",
    template: "jobRetry",
  })

  // 1. Find new professionals (Updated to include nested user configuration for emails)
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
    include: {
      user: true, 
    },
    take: 10,
  })

  if (professionals.length === 0) {
    await logActivity(job.id, "MATCHING_FAILED", "No professionals available", null)

    await notify({
      userId: job.user.id,
      email: job.user.email,
      title: "No Professionals Available",
      body: "We couldn't find any available professionals in your area. We'll try again soon.",
      type: "jobRetry",
      template: "jobRetry",
    })

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

    await notify({
      userId: pro.user.id,
      email: pro.user.email,
      title: "New Job Offer",
      body: `A job has been retried and you have received a new offer.`,
      type: "newOffer",
      template: "newOffer",
    })
  }

  return { retry: retryNumber, offers: professionals.length }
}
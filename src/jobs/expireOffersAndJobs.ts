import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"
import { retryMatching } from "./retryMatching"
import { notify } from "@/lib/notify"
import { OfferStatus, JobStatus } from "@prisma/client"

const BATCH_SIZE = 50   // ⭐ REQUIRED

export async function runExpirySweep() {
  const now = new Date()

  // 1) Expire offers
  const expiredOffers = await prisma.jobOffer.findMany({
    where: {
      status: OfferStatus.PENDING,
      expiresAt: { lt: now },
    },
    take: BATCH_SIZE,
  })

  for (const offer of expiredOffers) {
    await prisma.jobOffer.update({
      where: { id: offer.id },
      data: { status: OfferStatus.EXPIRED },
    })

    await logActivity(
      offer.jobId,
      "OFFER_EXPIRED",
      `Offer ${offer.id} expired`
    )
  }

  // 2) Expire jobs with no active offers
  const jobsToExpire = await prisma.job.findMany({
    where: {
      status: { in: [JobStatus.PENDING, JobStatus.MATCHING, JobStatus.OFFERED] },
      offers: {
        none: { status: OfferStatus.PENDING },
      },
      assignments: {
        none: {},
      },
    },
    include: {
      user: true, // ⭐ needed for notifications
    },
    take: BATCH_SIZE,
  })

  for (const job of jobsToExpire) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.EXPIRED },
    })

    await logActivity(job.id, "JOB_EXPIRED", "Job expired due to no active offers")

    // 🔥 Notify customer
    await notify(
      job.user.id,
      job.user.email,
      "Job Expired",
      "Your job expired due to no active offers",
      "jobExpired",
      `/dashboard/jobs/${job.id}`
    )

    // 🔥 Trigger retry
    await retryMatching(job.id)
  }

  return {
    expiredOffersCount: expiredOffers.length,
    expiredJobsCount: jobsToExpire.length,
  }
}

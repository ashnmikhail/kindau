import { prisma } from "@/lib/prisma";

/**
 * Checks if a professional is already booked or assigned
 * during the requested job time window.
 */
export async function hasConflict(professionalId: string, requestedDay: number, startTime: string, endTime: string) {
  // 1. Check existing bookings
  const bookings = await prisma.booking.findMany({
    where: {
      professionalId,
      deletedAt: null,
    },
    include: {
      job: true,
    },
  });

  for (const b of bookings) {
    if (!b.job) continue;

    if (
      b.job.requestedDay === requestedDay &&
      b.job.startTime &&
      b.job.endTime &&
      b.job.startTime <= endTime &&
      b.job.endTime >= startTime
    ) {
      return true;
    }
  }

  // 2. Check existing job assignments
  const assignments = await prisma.jobAssignment.findMany({
    where: { professionalId },
    include: { job: true },
  });

  for (const a of assignments) {
    if (!a.job) continue;

    if (
      a.job.requestedDay === requestedDay &&
      a.job.startTime &&
      a.job.endTime &&
      a.job.startTime <= endTime &&
      a.job.endTime >= startTime
    ) {
      return true;
    }
  }

  // 3. Check pending offers (tradie shouldn't get overlapping offers)
  const offers = await prisma.jobOffer.findMany({
    where: {
      professionalId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    include: { job: true },
  });

  for (const o of offers) {
    if (!o.job) continue;

    if (
      o.job.requestedDay === requestedDay &&
      o.job.startTime &&
      o.job.endTime &&
      o.job.startTime <= endTime &&
      o.job.endTime >= startTime
    ) {
      return true;
    }
  }

  return false;
}

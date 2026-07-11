import { prisma } from "@/lib/prisma"

/**
 * Centralised activity logger for job events.
 *
 * @param jobId - The job this activity belongs to
 * @param type - A strict, machine-readable event type
 * @param message - Human-readable message for the activity feed
 * @param userId - Optional user who performed the action (null for system events)
 */
export async function logActivity(
  jobId: string,
  type: ActivityType,
  message: string,
  userId: string | null = null
) {
  return prisma.activity.create({
    data: {
      jobId,
      userId,
      type,
      message,
    },
  })
}

/**
 * Strong typing for all valid activity event types.
 * Prevents typos and enforces consistency across the entire system.
 */
export type ActivityType =
  | "JOB_CREATED"
  | "MATCHING_STARTED"
  | "OFFER_SENT"
  | "OFFER_EXPIRED"
  | "OFFER_ACCEPTED"
  | "OFFER_DECLINED"
  | "PROFESSIONAL_ASSIGNED"
  | "BOOKING_CONFIRMED"
  | "PROFESSIONAL_EN_ROUTE"
  | "JOB_STARTED"
  | "JOB_COMPLETED"
  | "PAYMENT_COMPLETED"

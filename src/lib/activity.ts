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
  | "MATCHING_RETRY"
  | "MATCHING_FAILED"
  | "OFFER_SENT"
  | "OFFER_VIEWED"
  | "OFFER_EXPIRED"
  | "OFFER_ACCEPTED"
  | "OFFER_DECLINED"
  | "JOB_ASSIGNED"
  | "JOB_EXPIRED"
  | "CUSTOMER_VIEWED_JOB"
  | "PROFESSIONAL_VIEWED_JOB"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "PROFESSIONAL_EN_ROUTE"
  | "JOB_STARTED"
  | "JOB_COMPLETED"
  | "PAYMENT_COMPLETED"
  | "SYSTEM_ERROR"

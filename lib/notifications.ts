import { prisma } from "@/lib/prisma";

/**
 * Create a simple in‑app notification.
 * Title is optional because your UI doesn’t use it.
 */
export async function createInAppNotification(
  userId: string,
  message: string,
  title?: string,
  link?: string
) {
  return prisma.notification.create({
    data: {
      userId,
      message,
      title: title ?? null,
      link: link ?? null,
    },
  });
}

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

/**
 * Mark ALL notifications for a user as read.
 */
export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

/**
 * Fetch unread notifications for a user.
 */
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetch all notifications for a user.
 */
export async function getAllNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

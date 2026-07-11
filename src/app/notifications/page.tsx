export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">Please log in to view notifications.</p>
      </div>
    );
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  async function markAllRead() {
    "use server";
    await prisma.notification.updateMany({
      where: { userId: userId!, read: false },
      data: { read: true },
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-kindau-teal">Notifications</h1>

        {notifications.some((n) => !n.read) && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="text-sm text-kindau-orange hover:underline"
            >
              Mark all as read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 && (
        <p className="text-gray-500">You have no notifications.</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.link || "#"}
            className={`block border rounded-lg p-4 shadow-sm transition ${
              n.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">{n.title}</p>
            <p className="text-sm text-gray-700 mt-1">{n.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {n.createdAt.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

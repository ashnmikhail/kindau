import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export default async function NotificationsPage() {
  const user = await currentUser()
  if (!user) return <div>Please log in</div>

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {notifications.map((n) => (
        <div key={n.id} className="border p-4 rounded bg-white">
          <div className="font-semibold">{n.title}</div>
          <div>{n.message}</div>
          <div className="text-xs text-gray-500">
            {n.createdAt.toLocaleString()}
          </div>
          {n.link && (
            <a href={n.link} className="text-blue-600 underline text-sm">
              View
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

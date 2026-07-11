"use client"

export function ActivityFeed({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-4 border rounded-lg">
        No activity yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
        >
          <p className="text-gray-800 text-sm">{item.message}</p>

          <p className="text-xs text-gray-400 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}

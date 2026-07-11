interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const icons: Record<string, string> = {
  JOB_CREATED: "📝",
  MATCHING_STARTED: "🔍",
  OFFER_SENT: "📨",
  OFFER_ACCEPTED: "✅",
  OFFER_DECLINED: "❌",
  BOOKING_CONFIRMED: "📅",
  PROFESSIONAL_ASSIGNED: "👷",
  PROFESSIONAL_EN_ROUTE: "🚗",
  JOB_STARTED: "🛠️",
  JOB_COMPLETED: "🎉",
  PAYMENT_COMPLETED: "💳",
};

export default function ActivityFeed({
  activities,
}: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-bold">
          Activity
        </h2>

        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

          <div className="mb-4 text-5xl">
            📋
          </div>

          <h3 className="font-semibold text-gray-800">
            No activity yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Every important update about your job will appear here.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="border-b px-6 py-5">

        <h2 className="text-xl font-bold">
          Activity Timeline
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Live updates as your job progresses.
        </p>

      </div>

      <div className="relative px-8 py-6">

        <div className="absolute left-[31px] top-6 bottom-6 w-px bg-gray-200" />

        <div className="space-y-8">

          {activities.map((activity) => {

            const icon =
              icons[activity.type] ?? "📌";

            return (

              <div
                key={activity.id}
                className="relative flex gap-5"
              >

                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-xl shadow-sm">

                  {icon}

                </div>

                <div className="flex-1 pb-2">

                  <p className="font-semibold text-gray-900">
                    {activity.message}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {activity.createdAt.toLocaleString()}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}
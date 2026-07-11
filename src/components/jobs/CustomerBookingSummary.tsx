import { Prisma } from "@prisma/client";

type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    user: true;
    offers: { include: { professional: true } };
    activities: true;
    bookings: true;
  };
}>;

export default function CustomerBookingSummary({ job }: { job: JobWithRelations }) {
  const scheduled = job.bookings?.scheduledDate;
  if (!scheduled) return null;

  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm mt-6">
      <h3 className="text-lg font-semibold">Booking Confirmed</h3>
      <p className="text-gray-600 mt-2">
        Your professional has scheduled the job for:
      </p>

      <p className="text-kindau-teal font-bold mt-2 text-lg">
        {new Date(scheduled).toLocaleString()}
      </p>
    </div>
  );
}



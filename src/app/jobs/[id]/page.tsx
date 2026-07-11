import { prisma } from "@/lib/prisma";
import ProfessionalJobActions from "@/components/jobs/ProfessionalJobActions";
import CustomerBookingSummary from "@/components/jobs/CustomerBookingSummary";
import ActivityFeed from "@/components/jobs/ActivityFeed";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id: jobId } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      user: true,

      offers: {
        include: {
          professional: true,
        },
      },

      activities: {
        orderBy: {
          createdAt: "desc",
        },
      },

      bookings: true,   // ⭐ REQUIRED FIX
    },
  });

  if (!job) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold text-red-600">
          Job not found
        </h1>
      </div>
    );
  }

  const acceptedOffer = job.offers.find(
    (offer) => offer.status === "ACCEPTED"
  );

  const professional = acceptedOffer?.professional;

  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Job Details
        </h1>

        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Customer:</span>{" "}
          {job.user.name} ({job.user.email})
        </p>

        <p className="mt-1 text-gray-600">
          <span className="font-semibold">Status:</span>{" "}
          <span className="font-semibold text-kindau-teal">
            {job.status}
          </span>
        </p>

        {professional && (
          <p className="mt-1 text-gray-600">
            <span className="font-semibold">Assigned Professional:</span>{" "}
            {professional.name}
          </p>
        )}
      </div>

      <CustomerBookingSummary job={job} />

      {professional && (
        <ProfessionalJobActions job={job} />
      )}

      <div>
        <h2 className="mb-4 text-xl font-bold">Activity</h2>
        <ActivityFeed activities={job.activities} />
      </div>
    </div>
  );
}

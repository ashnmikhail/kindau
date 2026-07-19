import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import CurrentStageCard from "@/components/jobs/CurrentStageCard";
import ProgressIllustration from "@/components/jobs/ProgressIllustration";
import JobProgressTracker from "@/components/jobs/JobProgressTracker";
import LiveStatusCard from "@/components/jobs/LiveStatusCard";
import ProfessionalCard from "@/components/jobs/ProfessionalCard";
import OfferHistory from "@/components/jobs/OfferHistory";
import ActivityFeed from "@/components/jobs/ActivityFeed";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: Props) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });
  if (!user) redirect("/");

  const job = await prisma.job.findFirst({
    where: { id, userId: user.id },
    include: {
      subcategory: { include: { category: true } },
      assignments: { include: { professional: true } },
      offers: {
        include: { professional: true },
        orderBy: { createdAt: "asc" },
      },
      activities: { orderBy: { createdAt: "asc" } },

      // ⭐ NEW: include reviews
      reviews: true,
    },
  });

  if (!job) redirect("/customers/jobs");

  const steps = [
    "PENDING",
    "MATCHING",
    "OFFERED",
    "ASSIGNED",
    "CONTACT_PENDING",
    "BOOKED",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  const currentIndex = Math.max(steps.indexOf(job.status), 0);
  const assignedProfessional = job.assignments[0]?.professional;

  const hasReview = job.reviews && job.reviews.length > 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kindau-orange">
            Your Job
          </p>
          <h1 className="mt-2 text-4xl font-bold text-kindau-teal">
            {job.subcategory.name}
          </h1>
          <p className="mt-2 text-gray-500">
            Job #{job.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Top Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <CurrentStageCard status={job.status} />
            <ProgressIllustration currentIndex={currentIndex} />
            <JobProgressTracker status={job.status} />
            <LiveStatusCard status={job.status} />
          </div>

          <div className="space-y-8">
            <ProfessionalCard professional={assignedProfessional} />

            {/* Job Details */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Job Details</h2>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">
                    {job.subcategory.category.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold">{job.subcategory.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>
                    {job.suburb}, {job.postcode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Labour Price</p>
                  <p className="font-semibold text-kindau-teal">
                    ${job.price?.toString() ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{job.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* ⭐ NEW: Review Section */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Your Review</h2>

              {job.status !== "COMPLETED" && (
                <p className="text-gray-600 text-sm">
                  You can leave a review once the job is completed.
                </p>
              )}

              {job.status === "COMPLETED" && !hasReview && (
                <a
                  href={`/customers/jobs/${job.id}/review`}
                  className="inline-block bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition text-sm"
                >
                  Leave a Review
                </a>
              )}

              {hasReview && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-semibold text-kindau-teal">
                    {job.reviews[0].rating} / 5
                  </p>

                  <p className="text-sm text-gray-500">Comment</p>
                  <p className="leading-relaxed">
                    {job.reviews[0].comment || "No comment provided."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2 px-6 max-w-7xl mx-auto">
        <OfferHistory offers={job.offers} />
        <ActivityFeed activities={job.activities} />
      </div>
    </>
  );
}

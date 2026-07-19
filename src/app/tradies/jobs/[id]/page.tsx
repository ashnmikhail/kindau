import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TradieJobPage({ params }: PageProps) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // Fetch tradie
  const tradie = await prisma.professional.findUnique({
    where: { clerkId },
  });

  if (!tradie) redirect("/tradies");

  // Fetch job assigned to this tradie
  const job = await prisma.job.findFirst({
    where: {
      id,
      assignments: {
        some: { professionalId: tradie.id },
      },
    },
    include: {
      subcategory: { include: { category: true } },
      user: true, // customer
      assignments: { include: { professional: true } },
      offers: { include: { professional: true } },
      activities: { orderBy: { createdAt: "asc" } },
      reviews: true, // ⭐ NEW: include reviews
    },
  });

  if (!job) redirect("/tradies/jobs");

  const review = job.reviews?.[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-kindau-teal">
          {job.subcategory.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Job #{job.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Job Details */}
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Job Details</h2>

        <p className="text-gray-700">{job.description}</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>📍 {job.suburb}, {job.postcode}</p>
          <p>💲 <strong>${job.price}</strong></p>
          <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border rounded">
          <p className="text-sm font-medium text-blue-700">
            Customer: {job.user.firstName} {job.user.lastName}
          </p>
          <p className="text-sm text-blue-700">{job.user.email}</p>
        </div>
      </div>

      {/* ⭐ REVIEW SECTION */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Customer Review</h2>

        {job.status !== "COMPLETED" && (
          <p className="text-gray-600 text-sm">
            The job must be completed before a review can be left.
          </p>
        )}

        {job.status === "COMPLETED" && !review && (
          <p className="text-gray-600 text-sm">
            The customer has not left a review yet.
          </p>
        )}

        {review && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-semibold text-kindau-teal">
              {review.rating} / 5
            </p>

            <p className="text-sm text-gray-500">Comment</p>
            <p className="leading-relaxed">
              {review.comment || "No comment provided."}
            </p>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Activity</h2>

        {job.activities.length === 0 && (
          <p className="text-gray-600 text-sm">No activity yet.</p>
        )}

        <div className="space-y-2 mt-3">
          {job.activities.map((act: any) => (
            <div key={act.id} className="text-sm text-gray-700">
              <strong>{act.type}</strong> — {act.message}
              <div className="text-gray-500 text-xs">
                {new Date(act.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer History */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Offer History</h2>

        {job.offers.length === 0 && (
          <p className="text-gray-600 text-sm">No offers for this job.</p>
        )}

        <div className="space-y-2 mt-3">
          {job.offers.map((offer: any) => (
            <div key={offer.id} className="text-sm text-gray-700">
              Offer sent to: {offer.professional.name}
              <div className="text-gray-500 text-xs">
                {new Date(offer.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

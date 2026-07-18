import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { JobActions } from "./JobActions"

export default async function JobPage({ 
  params 
}: { 
  params: Promise<{ jobId: string }> 
}) {
  const resolvedParams = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.jobId },
    include: {
      reviews: true, // 1. Changed from 'review' to 'reviews'
      user: true,
      professional: true,
      subcategory: { include: { category: true } },
    },
  })

  if (!job) {
    return <div className="p-6">Job not found.</div>
  }

  const { userId } = await auth()

  // 2. Adjust the review check based on your schema structure:
  // If a job can have multiple reviews, check if the array is empty: job.reviews.length === 0
  // If it's a 1-to-1 relation but named plural, use: !job.reviews
  const hasNoReview = Array.isArray(job.reviews) ? job.reviews.length === 0 : !job.reviews;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        {job.subcategory.category.name} — {job.subcategory.name}
      </h1>

      <p>Status: {job.status}</p>

      <JobActions job={job} />

      {job.status === "COMPLETED" && hasNoReview && job.userId === userId && (
        <div className="mt-6">
          <Link
            href={`/dashboard/reviews/create?jobId=${job.id}`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md"
          >
            Leave a Review
          </Link>
        </div>
      )}
    </div>
  )
}
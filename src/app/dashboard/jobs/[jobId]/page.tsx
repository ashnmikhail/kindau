import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { JobActions } from "./JobActions"

// 1. Update params type to be a Promise
export default async function JobPage({ 
  params 
}: { 
  params: Promise<{ jobId: string }> 
}) {
  // 2. Await the params before using them
  const resolvedParams = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.jobId },
    include: {
      review: true,
      user: true,
      professional: true,
      subcategory: { include: { category: true } },
    },
  })

  if (!job) {
    return <div className="p-6">Job not found.</div>
  }

  const { userId } = await auth()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        {job.subcategory.category.name} — {job.subcategory.name}
      </h1>

      <p>Status: {job.status}</p>

      <JobActions job={job} />

      {job.status === "COMPLETED" && !job.review && job.userId === userId && (
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
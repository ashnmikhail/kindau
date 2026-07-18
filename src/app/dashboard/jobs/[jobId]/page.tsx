import { prisma } from "@/lib/prisma" // or your specific path to the prisma client instance
import Link from "next/link"
import { auth } from "@/auth" // or wherever your auth() helper is defined
import JobActions from "./JobActions" // adjust if JobActions is located elsewhere

type JobPageProps = {
  params: Promise<{
    jobId: string
  }>
}

export default async function JobPage({ params }: JobPageProps) {
  // 1. Await the dynamic params from Next.js 15
  const { jobId } = await params

  // 2. Fetch data using the resolved jobId
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      review: true,
      user: true,
      professional: true,
      subcategory: { include: { category: true } },
    },
  })

  // Optional but recommended: Handle if the job ID doesn't exist
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
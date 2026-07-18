type JobPageProps = {
  params: {
    jobId: string
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    include: {
      review: true,
      user: true,
      professional: true,
      subcategory: { include: { category: true } },
    },
  })

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

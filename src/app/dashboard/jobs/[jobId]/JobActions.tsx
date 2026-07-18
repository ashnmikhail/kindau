"use client"

export function JobActions({ job }) {
  async function startJob() {
    await fetch("/api/jobs/start", {
      method: "POST",
      body: JSON.stringify({ jobId: job.id }),
    })
    location.reload()
  }

  async function completeJob() {
    await fetch("/api/jobs/complete", {
      method: "POST",
      body: JSON.stringify({ jobId: job.id }),
    })
    location.reload()
  }

  return (
    <div className="space-y-3 mt-4">
      {job.status === "BOOKED" && (
        <button
          onClick={startJob}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Start Job
        </button>
      )}

      {job.status === "IN_PROGRESS" && (
        <button
          onClick={completeJob}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Complete Job
        </button>
      )}
    </div>
  )
}

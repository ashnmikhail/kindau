"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerJobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/customers/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  function statusBadge(status: string) {
    const base = "px-3 py-1 text-xs font-medium rounded border";

    switch (status) {
      case "PENDING":
        return `${base} bg-gray-100 border-gray-300 text-gray-700`;
      case "OFFERED":
        return `${base} bg-yellow-100 border-yellow-300 text-yellow-800`;
      case "ASSIGNED":
        return `${base} bg-blue-100 border-blue-300 text-blue-800`;
      case "IN_PROGRESS":
        return `${base} bg-purple-100 border-purple-300 text-purple-800`;
      case "COMPLETED":
        return `${base} bg-green-100 border-green-300 text-green-800`;
      default:
        return `${base} bg-gray-100 border-gray-300 text-gray-700`;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-kindau-teal">Your Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-600">You have no jobs yet.</p>
      )}

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {job.subcategory?.name}
              </h2>

              <span className={statusBadge(job.status)}>
                {job.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-gray-700 mt-2">{job.description}</p>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>📍 {job.suburb}, {job.postcode}</p>
              <p>💲 <strong>${job.price}</strong></p>
              <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            {job.assignment && (
              <div className="mt-3 p-3 bg-green-50 border rounded">
                <p className="text-sm font-medium text-green-700">
                  Assigned to: {job.assignment.professional.name}
                </p>
              </div>
            )}

            <Link
              href={`/customers/jobs/${job.id}`}
              className="mt-4 inline-block bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition"
            >
              View Job
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

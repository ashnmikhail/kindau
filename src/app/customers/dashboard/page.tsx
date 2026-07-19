"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    const res = await fetch("/api/customers/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  // Filter jobs belonging to this customer
  const customerJobs = jobs.filter((job: any) => job.userId);

  // Active jobs
  const activeJobs = customerJobs.filter((job: any) =>
    ["PENDING", "OFFERED", "ASSIGNED", "IN_PROGRESS"].includes(job.status)
  );

  // Completed jobs
  const completedJobs = customerJobs.filter(
    (job: any) => job.status === "COMPLETED"
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-kindau-teal">Your Jobs</h1>

      {/* ACTIVE JOBS */}
      <section>
        <h2 className="text-xl font-semibold text-kindau-teal mb-3">
          Active Jobs
        </h2>

        {activeJobs.length === 0 && (
          <p className="text-gray-600">No active jobs.</p>
        )}

        <div className="space-y-4">
          {activeJobs.map((job: any) => (
            <div
              key={job.id}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">
                {job.subcategory?.name}
              </h3>

              <p className="text-sm text-gray-600 mt-1">{job.description}</p>

              <p className="mt-2 text-sm">
                <span className="font-semibold">Status:</span>{" "}
                <span className="uppercase">{job.status}</span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                📍 {job.suburb}, {job.postcode}
              </p>

              <p className="text-sm text-gray-600">
                📅 {new Date(job.createdAt).toLocaleDateString()}
              </p>

              <Link
                href={`/customers/jobs/${job.id}`}
                className="mt-3 inline-block text-kindau-teal hover:underline text-sm"
              >
                View Job →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLETED JOBS */}
      <section>
        <h2 className="text-xl font-semibold text-kindau-teal mb-3">
          Completed Jobs
        </h2>

        {completedJobs.length === 0 && (
          <p className="text-gray-600">No completed jobs yet.</p>
        )}

        <div className="space-y-4">
          {completedJobs.map((job: any) => {
            const hasReview = job.reviews && job.reviews.length > 0;

            return (
              <div
                key={job.id}
                className="border p-4 rounded-lg bg-white shadow-sm"
              >
                <h3 className="font-semibold text-lg">
                  {job.subcategory?.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">{job.description}</p>

                <p className="text-sm text-gray-600 mt-1">
                  📍 {job.suburb}, {job.postcode}
                </p>

                <p className="text-sm text-gray-600">
                  📅 {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <Link
                  href={`/customers/jobs/${job.id}`}
                  className="mt-3 inline-block text-kindau-teal hover:underline text-sm"
                >
                  View Job →
                </Link>

                {!hasReview && (
                  <Link
                    href={`/customers/jobs/${job.id}/review`}
                    className="mt-3 inline-block bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition text-sm"
                  >
                    Leave a Review
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

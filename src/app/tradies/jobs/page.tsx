"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TradieAssignedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({ totalJobs: 0, totalEarnings: 0 });

  async function loadJobs() {
    const res = await fetch("/api/tradies/jobs");
    const data = await res.json();
    setJobs(data);
  }

  async function loadSummary() {
    const res = await fetch("/api/tradies/earnings");
    const data = await res.json();
    setSummary(data);
  }

  useEffect(() => {
    loadJobs();
    loadSummary();
  }, []);

  async function startJob(jobId: string) {
    await fetch("/api/jobs/start", {
      method: "POST",
      body: JSON.stringify({ jobId }),
    });
    loadJobs();
    loadSummary();
  }

  async function completeJob(jobId: string) {
    await fetch("/api/jobs/complete", {
      method: "POST",
      body: JSON.stringify({ jobId }),
    });
    loadJobs();
    loadSummary();
  }

  function statusBadge(status: string) {
    const base = "px-3 py-1 text-xs font-medium rounded border";

    switch (status) {
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
      {/* Earnings Summary */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-kindau-teal">
          Earnings Summary
        </h2>

        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <p>
            Completed Jobs: <strong>{summary.totalJobs}</strong>
          </p>
          <p>
            Total Earnings: <strong>${summary.totalEarnings}</strong>
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-kindau-teal">Assigned Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-600">No assigned jobs yet.</p>
      )}

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {job.subcategory?.name}
              </h2>

              <span className={statusBadge(job.status)}>
                {job.status.replace("_", " ")}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-2">{job.description}</p>

            {/* Metadata */}
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>
                📍 {job.suburb}, {job.postcode}
              </p>
              <p>
                💲 <strong>${job.price}</strong>
              </p>
              <p>👤 Customer: {job.customer?.firstName}</p>
              <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {job.status === "ASSIGNED" && (
                <button
                  onClick={() => startJob(job.id)}
                  className="bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition"
                >
                  Start Job
                </button>
              )}

              {job.status === "IN_PROGRESS" && (
                <button
                  onClick={() => completeJob(job.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Complete Job
                </button>
              )}
            </div>

            {/* View Job */}
            <Link
              href={`/tradies/jobs/${job.id}`}
              className="mt-4 inline-block text-kindau-teal hover:underline text-sm"
            >
              View Job →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

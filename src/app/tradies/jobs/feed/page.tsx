"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AcceptJobButton from "./AcceptJobButton";
import DeclineJobButton from "./DeclineJobButton";

export default function TradieJobFeedPage() {
  const [jobs, setJobs] = useState([]);

  async function loadJobs() {
    const res = await fetch("/api/professional/jobs");
    const data = await res.json();
    setJobs(data.jobs ?? []);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-kindau-teal">Available Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-600">No jobs available in your service area.</p>
      )}

      <div className="space-y-4">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            <h2 className="text-lg font-semibold">
              {job.subcategory.category.name} — {job.subcategory.name}
            </h2>

            <p className="text-gray-700 mt-2">{job.description}</p>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>📍 {job.suburb}, {job.postcode}</p>
              <p>👤 Customer: {job.user.name ?? job.user.email}</p>
              <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <AcceptJobButton jobId={job.id} />
              <DeclineJobButton jobId={job.id} />
            </div>

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

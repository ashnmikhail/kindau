"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-500">You have no jobs yet.</p>
      )}

      {jobs.map((job: any) => (
        <div key={job.id} className="border p-4 rounded-lg bg-white shadow-sm">
          <h2 className="font-semibold text-lg">{job.subcategory.name}</h2>
          <p className="text-sm text-gray-600">{job.description}</p>

          <p className="mt-2">
            <span className="font-semibold">Status:</span>{" "}
            <span className="uppercase">{job.status}</span>
          </p>

          {job.assignment && (
            <p className="mt-1 text-sm text-green-700">
              Assigned to: {job.assignment.professional.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

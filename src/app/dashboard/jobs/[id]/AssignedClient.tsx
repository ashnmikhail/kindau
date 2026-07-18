"use client";

import { useEffect, useState } from "react";

type AssignedClientProps = {
  job: any; // minimal fix to satisfy TypeScript for now
};

export default function AssignedClient({ job }: AssignedClientProps) {
  const [currentJob, setCurrentJob] = useState(job);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/jobs/full?id=${job.id}`);
      const data = await res.json();
      setCurrentJob(data);
    }, 3000);

    return () => clearInterval(interval);
  }, [job.id]);

  const assigned = currentJob.assignment?.professional;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {currentJob.subcategory.category.name} — {currentJob.subcategory.name}
      </h1>

      <p className="text-gray-600">{currentJob.description}</p>

      <p className="text-gray-500">
        {currentJob.suburb} {currentJob.postcode}
      </p>

      {assigned ? (
        <div className="border rounded p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Your tradie</h2>

          <p className="mt-2 text-gray-700">
            {assigned.businessName || assigned.name}
          </p>

          {assigned.phone && (
            <p className="text-gray-600">Phone: {assigned.phone}</p>
          )}

          {assigned.email && (
            <p className="text-gray-600">Email: {assigned.email}</p>
          )}
        </div>
      ) : (
        <div className="text-gray-500">
          Waiting for a tradie to accept…
        </div>
      )}
    </div>
  );
}

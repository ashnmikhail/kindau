"use client";

import { useEffect, useState } from "react";

type FindingClientProps = {
  job: any; // minimal fix to satisfy TypeScript for now
};

export default function FindingClient({ job }: FindingClientProps) {
  const [status, setStatus] = useState(job.status);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/jobs/status?id=${job.id}`);
      const data = await res.json();
      setStatus(data.status);

      if (data.status === "ASSIGNED") {
        window.location.href = `/dashboard/jobs/${job.id}`;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [job.id]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Finding a tradie…</h1>

      {status === "PENDING" && (
        <div className="text-gray-600">
          Contacting tradies in your area…
        </div>
      )}

      {status === "OFFERED" && (
        <div className="text-gray-600">
          A tradie is reviewing your job…
        </div>
      )}

      {status === "EXPIRED" && (
        <div className="text-red-600">
          No tradies available right now.
        </div>
      )}
    </div>
  );
}

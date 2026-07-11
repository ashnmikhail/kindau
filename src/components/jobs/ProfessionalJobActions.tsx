"use client";

import { Prisma } from "@prisma/client";
import { useState } from "react";

type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    user: true;
    offers: { include: { professional: true } };
    activities: true;
    bookings: true;
  };
}>;

export default function ProfessionalJobActions({ job }: { job: JobWithRelations }) {
  const [loading, setLoading] = useState(false);

  async function startJob() {
    setLoading(true);
    try {
      await fetch(`/api/jobs/${job.id}/start`, { method: "POST" });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function completeJob() {
    setLoading(true);
    try {
      await fetch(`/api/jobs/${job.id}/complete`, { method: "POST" });
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Professional Actions</h3>

      <div className="mt-4 space-x-4">
        <button
          onClick={startJob}
          disabled={loading}
          className="rounded-lg bg-kindau-teal px-4 py-2 text-white"
        >
          Start Job
        </button>

        <button
          onClick={completeJob}
          disabled={loading}
          className="rounded-lg bg-gray-800 px-4 py-2 text-white"
        >
          Complete Job
        </button>
      </div>
    </div>
  );
}

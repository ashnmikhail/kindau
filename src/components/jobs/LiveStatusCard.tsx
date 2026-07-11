"use client";

import { JobStatus } from "@prisma/client";

export default function LiveStatusCard({
  status,
}: {
  status: JobStatus;
}) {
  const messages: Record<string, string> = {
    PENDING: "We've received your request and are preparing to match you.",
    MATCHING: "Searching for the next available verified professional near you.",
    OFFERED: "An offer has been sent to a local professional. They have a limited time to respond.",
    ASSIGNED: "Great news! A professional has accepted your job.",
    BOOKED: "Your booking has been confirmed.",
    IN_PROGRESS: "Your professional is currently completing the work.",
    COMPLETED: "Your job has been completed successfully.",
    CANCELLED: "This job has been cancelled.",
    EXPIRED: "This job offer expired before a professional accepted.",
  };

  return (
    <div className="rounded-2xl bg-kindau-teal text-white p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
        <h2 className="text-xl font-bold">Live Job Status</h2>
      </div>

      <p className="text-white/90 leading-relaxed">
        {messages[status] ?? "Tracking your job."}
      </p>
    </div>
  );
}

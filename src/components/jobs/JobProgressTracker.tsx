"use client";

import { JobStatus } from "@prisma/client";

const steps = [
  { key: "PENDING", title: "Job Submitted" },
  { key: "MATCHING", title: "Finding Professionals" },
  { key: "OFFERED", title: "Offer Sent" },
  { key: "ASSIGNED", title: "Professional Accepted" },
  { key: "BOOKED", title: "Booking Confirmed" },
  { key: "IN_PROGRESS", title: "Professional On The Way" },
  { key: "COMPLETED", title: "Completed" },
];

interface Props {
  status: JobStatus;
}

export default function JobProgressTracker({ status }: Props) {
  const current = steps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const completed = index < current;
        const active = index === current;

        return (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                completed
                  ? "bg-green-600"
                  : active
                  ? "bg-kindau-orange animate-pulse"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>

            <p
              className={`font-medium ${
                active
                  ? "text-kindau-orange"
                  : completed
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

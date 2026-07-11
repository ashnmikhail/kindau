"use client";

import { useState } from "react";

export default function ProfessionalBookingForm({ jobId }: { jobId: string }) {
  const [scheduledFor, setScheduledFor] = useState("");

  async function submit() {
    await fetch(`/api/jobs/${jobId}/accept`, {
      method: "POST",
      body: JSON.stringify({ scheduledFor }),
    });

    window.location.reload();
  }

  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Confirm Booking Time</h3>

      <input
        type="datetime-local"
        value={scheduledFor}
        onChange={(e) => setScheduledFor(e.target.value)}
        className="border rounded-lg p-3 w-full"
      />

      <button
        onClick={submit}
        className="mt-4 w-full bg-kindau-teal text-white py-3 rounded-lg font-semibold"
      >
        Confirm Booking
      </button>
    </div>
  );
}

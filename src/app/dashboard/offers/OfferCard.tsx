"use client";

import { useState } from "react";

export default function OfferCard({ offer }) {
  const [loading, setLoading] = useState(false);

  async function accept() {
    setLoading(true);
    await fetch("/api/offers/accept", {
      method: "POST",
      body: JSON.stringify({ offerId: offer.id }),
    });
    window.location.reload();
  }

  async function decline() {
    setLoading(true);
    await fetch("/api/offers/decline", {
      method: "POST",
      body: JSON.stringify({ offerId: offer.id }),
    });
    window.location.reload();
  }

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h2 className="font-semibold text-lg">
        {offer.job.subcategory.category.name} — {offer.job.subcategory.name}
      </h2>

      <p className="text-gray-600 mt-2">{offer.job.description}</p>

      <p className="text-gray-500 mt-1">
        {offer.job.suburb} {offer.job.postcode}
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={accept}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Accept
        </button>

        <button
          onClick={decline}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

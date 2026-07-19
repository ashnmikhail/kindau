"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TradieOffersPage() {
  const [offers, setOffers] = useState([]);

  async function loadOffers() {
    const res = await fetch("/api/professional/offers");
    const data = await res.json();
    setOffers(data ?? []);
  }

  useEffect(() => {
    loadOffers();
  }, []);

  async function acceptOffer(offerId: string, jobId: string) {
    const res = await fetch(`/api/offers/${offerId}/accept`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = `/tradies/jobs/${jobId}`;
    } else {
      alert("Job already taken.");
    }
  }

  async function declineOffer(offerId: string) {
    await fetch(`/api/offers/${offerId}/decline`, {
      method: "POST",
    });

    loadOffers();
  }

  function statusBadge(offer: any) {
    const job = offer.job;
    const assigned = job.assignment?.professionalId === offer.professionalId;
    const someoneElseAssigned = job.assignment && !assigned;

    if (assigned)
      return (
        <span className="text-sm px-3 py-1 rounded bg-green-100 border border-green-300 text-green-700">
          Assigned to you
        </span>
      );

    if (someoneElseAssigned)
      return (
        <span className="text-sm px-3 py-1 rounded bg-red-100 border border-red-300 text-red-700">
          Assigned to another tradie
        </span>
      );

    return (
      <span className="text-sm px-3 py-1 rounded bg-yellow-100 border border-yellow-300 text-yellow-800">
        Offer Sent
      </span>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-kindau-teal">Your Offers</h1>

      {offers.length === 0 && (
        <p className="text-gray-600">No offers yet.</p>
      )}

      <div className="space-y-4">
        {offers.map((offer: any) => {
          const job = offer.job;

          return (
            <div
              key={offer.id}
              className="border rounded-lg p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {job.subcategory?.name}
                </h2>

                {statusBadge(offer)}
              </div>

              <p className="text-gray-700 mt-2">{job.description}</p>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>📍 {job.suburb}, {job.postcode}</p>
                <p>💲 <strong>${job.price}</strong></p>
                <p>👤 Customer: {job.customer?.firstName}</p>
                <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>

              {!job.assignment && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => acceptOffer(offer.id, job.id)}
                    className="bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => declineOffer(offer.id)}
                    className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Decline
                  </button>
                </div>
              )}

              <Link
                href={`/tradies/jobs/${job.id}`}
                className="mt-4 inline-block text-kindau-teal hover:underline text-sm"
              >
                View Job →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

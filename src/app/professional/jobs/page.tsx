"use client";

import { useEffect, useState } from "react";

interface Offer {
  id: string;
  createdAt: string;

  job: {
    id: string;
    description: string;
    suburb: string | null;
    postcode: string | null;
    price: number | null;

    subcategory: {
      name: string;

      category: {
        name: string;
      };
    };
  };
}

export default function ProfessionalJobsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    const res = await fetch("/api/professional/jobs");

    if (!res.ok) return;

    const data = await res.json();

    setOffers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();

    const interval = setInterval(loadJobs, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold">
          Available Jobs
        </h1>

        <p className="mt-4 text-gray-500">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Available Jobs
      </h1>

      {offers.length === 0 && (
        <div className="rounded-xl border p-8 bg-white">
          <h2 className="font-semibold text-lg">
            No jobs available
          </h2>

          <p className="text-gray-500 mt-2">
            We'll notify you as soon as a suitable job becomes available.
          </p>
        </div>
      )}

      <div className="space-y-6">

        {offers.map((offer) => (

          <div
            key={offer.id}
            className="rounded-xl border bg-white shadow-sm p-6"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  {offer.job.subcategory.name}
                </h2>

                <p className="text-gray-500">
                  {offer.job.subcategory.category.name}
                </p>

              </div>

              <div className="text-right">

                <div className="text-2xl font-bold text-kindau-teal">
                  ${offer.job.price ?? 0}
                </div>

                <div className="text-sm text-gray-500">
                  Fixed Labour Price
                </div>

              </div>

            </div>

            <div className="mt-6">

              <p className="text-gray-700">
                {offer.job.description}
              </p>

            </div>

            <div className="mt-4 text-sm text-gray-500">

              📍 {offer.job.suburb}, {offer.job.postcode}

            </div>

            <div className="flex gap-4 mt-8">

              <button
                className="px-6 py-3 rounded-lg bg-kindau-teal text-white hover:opacity-90"
              >
                Accept Job
              </button>

              <button
                className="px-6 py-3 rounded-lg border hover:bg-gray-100"
              >
                Decline
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
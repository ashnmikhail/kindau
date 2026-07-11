"use client";

import { useEffect, useState } from "react";

type DashboardResponse = {
  professional: any;
  offers: any[];
  activeJobs: any[];
  completedJobs: any[];
  subscription: {
    status: string | null;
    renewal: string | null;
  };
};

export default function TradieDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/professional/dashboard");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600">
        Unable to load dashboard.
      </div>
    );
  }

  const { professional, offers, activeJobs, completedJobs, subscription } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {professional.name}</h1>
        <p className="text-gray-600 mt-1">Your KindAu professional dashboard</p>
      </div>

      {/* New Job Offers */}
      <section className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔴 New Job Offers</h2>

        {offers.length === 0 && (
          <p className="text-gray-500">No new offers right now.</p>
        )}

        <div className="space-y-4">
          {offers.map((offer) => {
            const expiresIn =
              (new Date(offer.expiresAt).getTime() - Date.now()) / 1000 / 60;

            return (
              <div
                key={offer.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{offer.job.subcategory.name}</p>
                  <p className="text-gray-600">{offer.job.suburb}</p>
                  <p className="text-gray-800 font-semibold">
                    ${offer.job.price}
                  </p>
                  <p className="text-sm text-red-600">
                    {Math.max(0, Math.floor(expiresIn))} minutes remaining
                  </p>
                </div>

                <div className="flex gap-3">
                  {/* ACCEPT */}
                  <button
                    onClick={async () => {
                      await fetch(`/api/professional/offers/${offer.id}/accept`, {
                        method: "POST",
                      });
                      load();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Accept
                  </button>

                  {/* DECLINE */}
                  <button
                    onClick={async () => {
                      await fetch(`/api/professional/offers/${offer.id}/decline`, {
                        method: "POST",
                      });
                      load();
                    }}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Jobs */}
      <section className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🟡 Current Jobs</h2>

        {activeJobs.length === 0 && (
          <p className="text-gray-500">No active jobs.</p>
        )}

        <div className="space-y-4">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{job.subcategory.name}</p>
                <p className="text-gray-600">{job.user.name}</p>
                <p className="text-gray-600">{job.suburb}</p>
              </div>

              <div className="flex gap-3">
                {/* CONTACT → OPEN CHAT */}
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={async () => {
                    const res = await fetch("/api/conversations/start", {
                      method: "POST",
                      body: JSON.stringify({ jobId: job.id }),
                    });
                    const json = await res.json();
                    window.location.href = `/tradies/chat/${json.conversationId}`;
                  }}
                >
                  Contact
                </button>

                {/* START JOB */}
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                  onClick={async () => {
                    await fetch(`/api/professional/jobs/${job.id}/start`, {
                      method: "POST",
                    });
                    load();
                  }}
                >
                  Start Job
                </button>

                {/* COMPLETE JOB */}
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={async () => {
                    await fetch(`/api/professional/jobs/${job.id}/complete`, {
                      method: "POST",
                    });
                    load();
                  }}
                >
                  Complete Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Jobs */}
      <section className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🟢 Completed Jobs</h2>

        {completedJobs.length === 0 && (
          <p className="text-gray-500">No completed jobs yet.</p>
        )}

        <ul className="space-y-2">
          {completedJobs.map((job) => (
            <li key={job.id} className="border p-3 rounded-lg">
              {job.subcategory.name} — {job.user.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Membership */}
      <section className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">⚙ Membership</h2>

        <p className="text-gray-700">
          Status:{" "}
          <span className="font-semibold">{subscription.status ?? "N/A"}</span>
        </p>

        {subscription.renewal && (
          <p className="text-gray-700">
            Renews:{" "}
            <span className="font-semibold">
              {new Date(subscription.renewal).toLocaleDateString()}
            </span>
          </p>
        )}

        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
          Manage Subscription
        </button>
      </section>
    </div>
  );
}

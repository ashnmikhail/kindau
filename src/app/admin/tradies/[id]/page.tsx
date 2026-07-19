export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface AdminTradieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTradieDetailPage({ params }: AdminTradieDetailPageProps) {
  const { id } = await params;

  const tradie = await prisma.professional.findUnique({
    where: { id },
    include: {
      user: true,
      categories: { include: { category: true } },
      serviceAreas: true,
      availability: true,
      jobOffers: {
        include: {
          job: { include: { subcategory: true } },
        },
      },
      jobAssignments: {
        include: {
          job: { include: { subcategory: true } },
        },
      },
      bookings: {
        include: {
          job: { include: { subcategory: true } },
          customer: true,
          professional: true,
        },
      },
    },
  });

  if (!tradie) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-kindau-teal">
        {tradie.name || tradie.user?.name || tradie.user?.email}
      </h1>

      {/* BASIC INFO */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Basic Info</h2>
        <p>Email: {tradie.user?.email}</p>
        <p>Phone: {tradie.phone}</p>
        <p>ABN: {tradie.abn}</p>
        <p>Business Name: {tradie.businessName}</p>
        <p>
          Status:{" "}
          {tradie.isVerified ? (
            <span className="text-green-600 font-semibold">Verified</span>
          ) : (
            <span className="text-yellow-600 font-semibold">Pending</span>
          )}
        </p>
      </section>

      {/* SKILLS */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Skills</h2>
        {tradie.categories.length === 0 ? (
          <p className="text-gray-500">No skills selected</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.categories.map((c) => (
              <li key={c.id}>{c.category.name}</li>
            ))}
          </ul>
        )}
      </section>

      {/* SERVICE AREAS */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Service Areas</h2>
        {tradie.serviceAreas.length === 0 ? (
          <p className="text-gray-500">No service areas</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.serviceAreas.map((a) => (
              <li key={a.id}>
                {a.suburb} {a.postcode} {a.state}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* AVAILABILITY */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Availability</h2>
        {tradie.availability.length === 0 ? (
          <p className="text-gray-500">No availability set</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.availability.map((a) => (
              <li key={a.id}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][a.dayOfWeek]} —{" "}
                {a.startTime} to {a.endTime}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* JOB OFFERS */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Job Offers</h2>
        {tradie.jobOffers.length === 0 ? (
          <p className="text-gray-500">No job offers</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.jobOffers.map((o) => (
              <li key={o.id}>
                Offer for: {o.job.subcategory.name} — Status: {o.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* JOB ASSIGNMENTS */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Assigned Jobs</h2>
        {tradie.jobAssignments.length === 0 ? (
          <p className="text-gray-500">No assigned jobs</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.jobAssignments.map((a) => (
              <li key={a.id}>
                {a.job.subcategory.name} — {a.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* BOOKINGS */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold">Bookings</h2>
        {tradie.bookings.length === 0 ? (
          <p className="text-gray-500">No bookings</p>
        ) : (
          <ul className="list-disc ml-6">
            {tradie.bookings.map((b) => (
              <li key={b.id}>
                {b.job.subcategory.name} — Customer: {b.customer.name || b.customer.email}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ACTIONS */}
      <section className="border rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Verification Actions</h2>

        <div className="flex gap-4">
          <form action="/api/admin/tradies/verify" method="POST">
            <input type="hidden" name="id" value={tradie.id} />
            <button className="bg-green-600 text-white px-6 py-3 rounded">
              Approve
            </button>
          </form>

          <form action="/api/admin/tradies/reject" method="POST">
            <input type="hidden" name="id" value={tradie.id} />
            <button className="bg-red-600 text-white px-6 py-3 rounded">
              Reject
            </button>
          </form>
        </div>

        <Link href="/admin/tradies" className="text-kindau-teal underline">
          Back to list
        </Link>
      </section>
    </div>
  );
}

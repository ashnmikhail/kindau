export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTradiesPage() {
  const tradies = await prisma.professional.findMany({
    orderBy: { createdAt: "desc" },
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">Tradies</h1>

      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Skills</th>
            <th className="p-3 text-left">Service Areas</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tradies.map((t) => (
            <tr key={t.id} className="border-t align-top">
              <td className="p-3">
                <div className="font-semibold">{t.fullName}</div>
                <div className="text-sm text-gray-600">{t.user?.email}</div>
              </td>

              <td className="p-3">
                {t.categories.length === 0 ? (
                  <span className="text-gray-500 text-sm">None</span>
                ) : (
                  <ul className="list-disc ml-4 text-sm">
                    {t.categories.map((c) => (
                      <li key={c.id}>{c.category.name}</li>
                    ))}
                  </ul>
                )}
              </td>

              <td className="p-3">
                {t.serviceAreas.length === 0 ? (
                  <span className="text-gray-500 text-sm">None</span>
                ) : (
                  <ul className="list-disc ml-4 text-sm">
                    {t.serviceAreas.map((a) => (
                      <li key={a.id}>
                        {a.suburb} {a.postcode} {a.state}
                      </li>
                    ))}
                  </ul>
                )}
              </td>

              <td className="p-3">
                {t.isVerified ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Pending</span>
                )}
              </td>

              <td className="p-3">
                <Link
                  href={`/admin/tradies/${t.id}`}
                  className="text-kindau-teal underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";

export default async function AdminTradiesPage() {
  const tradies = await prisma.professional.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      categories: {
        include: { category: true },
      },
      serviceAreas: true,
      availability: true,
      jobOffers: {
        include: {
          job: {
            include: { subcategory: true },
          },
        },
      },
      jobAssignments: {
        include: {
          job: {
            include: { subcategory: true },
          },
        },
      },
      bookings: {
        include: {
          job: {
            include: { subcategory: true },
          },
          customer: true,      // VALID — Booking still has customer
          professional: true,  // Also valid
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tradies</h1>
      <pre>{JSON.stringify(tradies, null, 2)}</pre>
    </div>
  );
}

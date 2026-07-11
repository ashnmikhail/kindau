export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Update the type to accept a Promise for params
interface AdminTradieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTradieDetailPage({
  params,
}: AdminTradieDetailPageProps) {
  // Await the params to resolve the dynamic ID
  const { id } = await params;

  const tradie = await prisma.professional.findUnique({
    where: { id },
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
          customer: true, // VALID — Booking still has customer
          professional: true,
        },
      },
    },
  });

  if (!tradie) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{tradie.name}</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(tradie, null, 2)}
      </pre>
    </div>
  );
}

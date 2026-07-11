export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Updated type: params must be a Promise
interface AdminJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminJobDetailPage({
  params,
}: AdminJobDetailPageProps) {
  // Await the params to resolve the ID
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      user: true,
      subcategory: true,

      // FIXED: jobAssignments → assignments
      assignments: {
        include: { professional: true },
      },

      // FIXED: jobOffers → offers
      offers: {
        include: { professional: true },
      },

      bookings: {
        include: {
          professional: true,
          customer: true,
        },
      },

      activities: true,

      conversation: {
        include: {
          messages: true,
          participants: true,
        },
      },
    },
  });

  if (!job) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Job Details</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(job, null, 2)}
      </pre>
    </div>
  );
}

export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      // Job has "user", not "customer"
      user: true,

      subcategory: true,

      // FIX: jobAssignments → assignments
      assignments: {
        include: { professional: true },
      },

      // FIX: jobOffers → offers
      offers: {
        include: { professional: true },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Jobs</h1>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </div>
  );
}

export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Fetch counts
  const totalJobs = await prisma.job.count();
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });
  const totalTradies = await prisma.professional.count();

  // Jobs by status
  const jobsByStatus = await prisma.job.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      <div className="space-y-4">
        <p>Total Jobs: {totalJobs}</p>
        <p>Total Customers: {totalCustomers}</p>
        <p>Total Tradies: {totalTradies}</p>

        <h2 className="text-lg font-semibold mt-6">Jobs by Status</h2>
        <pre>{JSON.stringify(jobsByStatus, null, 2)}</pre>
      </div>
    </div>
  );
}

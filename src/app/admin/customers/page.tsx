export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      jobs: true,
      bookings: true,
      notifications: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      <pre>{JSON.stringify(customers, null, 2)}</pre>
    </div>
  );
}

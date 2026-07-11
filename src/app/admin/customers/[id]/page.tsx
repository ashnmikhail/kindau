export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  // 1. Await params as required by Next.js 15
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      jobs: {
        include: {
          subcategory: true,
        },
      },
      bookings: {
        include: {
          job: true,
          professional: true,
        },
      },
      notifications: true,
    },
  });

  // 2. Use Next.js notFound() for a better 404 experience
  if (!customer) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{customer.name}</h1>

      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>

      <h2 className="text-lg font-semibold mt-6">Jobs</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(customer.jobs, null, 2)}
      </pre>

      <h2 className="text-lg font-semibold mt-6">Bookings</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(customer.bookings, null, 2)}
      </pre>

      <h2 className="text-lg font-semibold mt-6">Notifications</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(customer.notifications, null, 2)}
      </pre>
    </div>
  );
}
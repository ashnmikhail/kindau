export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";

export default async function AdminOffersPage() {
  const offers = await prisma.jobOffer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      professional: true,
      job: {
        include: {
          // FIX: Job no longer has "customer", it has "user"
          user: true,
          subcategory: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Offers</h1>
      <pre>{JSON.stringify(offers, null, 2)}</pre>
    </div>
  );
}

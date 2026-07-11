import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function EarningsSummary() {
  const { userId } = await auth();

  if (!userId) return null;

  // Load all assignments + job prices
  const assignments = await prisma.jobAssignment.findMany({
    where: { professionalId: userId },
    include: {
      job: {
        select: { price: true },
      },
    },
  });

  // Sum job prices
  const total = assignments.reduce((sum, a) => {
    return sum + Number(a.job?.price ?? 0);
  }, 0);

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-kindau-teal">
        Earnings Summary
      </h2>
      <p className="text-2xl font-bold mt-2">${total.toString()}</p>
    </div>
  );
}

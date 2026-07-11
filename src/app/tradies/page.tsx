import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function TradiesPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!dbUser) {
    return (
      <div className="p-6">
        User record not found.
      </div>
    );
  }

  const professional = await prisma.professional.findUnique({
    where: {
      userId: dbUser.id,
    },
    select: {
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Tradie Dashboard</h1>

      <div className="mt-4">
        <p>Status: {professional?.subscriptionStatus ?? "none"}</p>
        <p>
          Next billing:{" "}
          {professional?.subscriptionCurrentPeriodEnd?.toString() ?? "N/A"}
        </p>
      </div>
    </div>
  );
}

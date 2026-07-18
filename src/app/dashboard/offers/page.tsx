import { prisma } from "@/lib/prisma";
import OfferCard from "./OfferCard";
import { currentUser } from "@clerk/nextjs/server";

export default async function OffersPage() {
  const user = await currentUser();

  if (!user) return <div>Please log in</div>;

  const professional = await prisma.professional.findUnique({
    where: { userId: user.id },
  });

  if (!professional) return <div>No professional profile found</div>;

  const offers = await prisma.jobOffer.findMany({
    where: {
      professionalId: professional.id,
      status: "PENDING",
    },
    include: {
      job: {
        include: {
          subcategory: {
            include: { category: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Job Offers</h1>

      {offers.length === 0 && (
        <div className="text-gray-500">No offers right now</div>
      )}

      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

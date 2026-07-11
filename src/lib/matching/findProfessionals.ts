import { prisma } from "@/lib/prisma";

export async function findProfessionals(
  categoryId: string,
  postcode: string
) {
  return prisma.professional.findMany({
    where: {
      isActive: true,
      subscriptionStatus: "active",
      onboardingCompleted: true,

      categories: {
        some: {
          categoryId,
        },
      },

      serviceAreas: {
        some: {
          postcode,
        },
      },
    },
  });
}
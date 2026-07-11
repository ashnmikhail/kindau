import { prisma } from "@/lib/prisma"

/**
 * Ensures a rotationState exists for a professional + category
 * and updates lastAssignedAt for fairness.
 */
export async function updateRotationState(
  professionalId: string,
  categoryId: string,
  suburb: string = ""
) {
  return prisma.rotationState.upsert({
    where: {
      professionalId_categoryId_suburb: {
        professionalId,
        categoryId,
        suburb,
      },
    },
    create: {
      professionalId,
      categoryId,
      suburb,
      lastAssignedAt: new Date(),
    },
    update: {
      lastAssignedAt: new Date(),
    },
  })
}

/**
 * Initialize rotation state for a tradie when they complete onboarding
 * or when they add a new category.
 */
export async function ensureRotationState(
  professionalId: string,
  categoryId: string,
  suburb: string = ""
) {
  const existing = await prisma.rotationState.findUnique({
    where: {
      professionalId_categoryId_suburb: {
        professionalId,
        categoryId,
        suburb,
      },
    },
  })

  if (existing) return existing

  return prisma.rotationState.create({
    data: {
      professionalId,
      categoryId,
      suburb,
      lastAssignedAt: new Date(0),
    },
  })
}

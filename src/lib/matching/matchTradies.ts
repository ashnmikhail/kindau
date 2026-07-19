// src/lib/matching/matchTradies.ts
import { prisma } from "@/lib/prisma";

type MatchTradiesInput = {
  categoryId: string;
  subcategoryId?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  dayOfWeek: number;      // 0–6
  startTime: string;      // "09:00"
  endTime: string;        // "11:00"
};

export async function matchTradies(input: MatchTradiesInput) {
  const {
    categoryId,
    subcategoryId,
    suburb,
    postcode,
    state,
    dayOfWeek,
    startTime,
    endTime,
  } = input;

  // 1. Base filter: verified professionals with matching category
  const tradies = await prisma.professional.findMany({
    where: {
      isVerified: true,
      deletedAt: null,
      categories: {
        some: {
          categoryId,
          ...(subcategoryId ? { subcategoryId } : {}),
        },
      },
      serviceAreas: suburb || postcode || state
        ? {
            some: {
              ...(suburb ? { suburb } : {}),
              ...(postcode ? { postcode } : {}),
              ...(state ? { state } : {}),
            },
          }
        : undefined,
    },
    include: {
      user: true, // ⭐ REQUIRED FIX
      availability: true,
      serviceAreas: true,
      categories: { include: { category: true } },
    },
  });

  // 2. Time overlap filter (simple string comparison works for HH:MM)
  const matches = tradies.filter((t) =>
    t.availability.some((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;
      return slot.startTime <= endTime && slot.endTime >= startTime;
    })
  );

  // 3. Return a clean shape for downstream use
  return matches.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.user?.email,
    categories: t.categories.map((c) => c.category.name),
    serviceAreas: t.serviceAreas.map((a) => ({
      suburb: a.suburb,
      postcode: a.postcode,
      state: a.state,
    })),
  }));
}

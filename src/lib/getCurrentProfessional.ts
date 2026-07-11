import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentProfessional() {
  const { userId } = await auth();   // FIXED: auth() must be awaited here

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      professional: {
        include: {
          categories: { include: { category: true } },
          serviceAreas: true,
          rotationStates: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.professional) throw new Error("Professional profile not found");

  return user.professional;
}

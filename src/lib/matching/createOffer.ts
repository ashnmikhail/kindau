import { prisma } from "@/lib/prisma";

export async function createOffer(
  jobId: string,
  professionalId: string
) {
  return prisma.jobOffer.create({
    data: {
      jobId,
      professionalId,
      expiresAt: new Date(
        Date.now() + 20 * 60 * 1000
      ),
    },
  });
}
import { prisma } from "@/lib/prisma";
import { expandRadiusPostcodes } from "./radius";

/**
 * MAIN ROTATION ENGINE
 */
export async function runRotationForJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      subcategory: {
        include: { category: true },
      },
    },
  });

  if (!job) return;

  const categoryId = job.subcategory.categoryId;
  const jobPostcode = job.postcode ?? "";

  const rings = [1, 2, 3, 4];

  for (const ring of rings) {
    const postcodes = expandRadiusPostcodes(jobPostcode, ring);

    const tradies = await getEligibleTradies(categoryId, postcodes);

    if (!tradies.length) continue;

    const ordered = await orderByRotation(tradies, categoryId, job.suburb ?? "");

    const offered = await offerToFirstTradie(job, ordered);

    if (offered) return;
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "EXPIRED" },
  });
}

/**
 * GET ELIGIBLE TRADIES
 */
async function getEligibleTradies(categoryId: string, postcodes: string[]) {
  return prisma.professional.findMany({
    where: {
      isActive: true,
      subscriptionStatus: "active",
      categories: { some: { categoryId } },
      serviceAreas: {
        some: {
          postcode: { in: postcodes },
        },
      },
    },
    select: { id: true },
  });
}

/**
 * ORDER TRADIES BY LAST ASSIGNMENT
 */
async function orderByRotation(
  tradies: { id: string }[],
  categoryId: string,
  suburb: string
) {
  const ids = tradies.map((t) => t.id);

  return prisma.rotationState.findMany({
    where: {
      categoryId,
      suburb,
      professionalId: { in: ids },
    },
    orderBy: {
      lastAssignedAt: "asc", // null first, oldest next
    },
  });
}

/**
 * OFFER JOB TO FIRST TRADIE
 */
async function offerToFirstTradie(job: any, ordered: any[]) {
  if (!ordered.length) return false;

  const first = ordered[0];

  await prisma.jobOffer.create({
    data: {
      jobId: job.id,
      professionalId: first.professionalId,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await prisma.job.update({
    where: { id: job.id },
    data: { status: "OFFERED" },
  });

  return true;
}

/**
 * ACCEPT OFFER
 */
export async function handleOfferAcceptance(offerId: string) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
  });

  if (!offer) return;

  await prisma.jobAssignment.create({
    data: {
      jobId: offer.jobId,
      professionalId: offer.professionalId,
    },
  });

  await bumpProfessionalToBottom(offer.professionalId);

  await prisma.job.update({
    where: { id: offer.jobId },
    data: { status: "ASSIGNED" },
  });
}

/**
 * DECLINE OFFER
 */
export async function handleOfferDecline(offerId: string) {
  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
  });

  if (!offer) return;

  await bumpProfessionalToBottom(offer.professionalId);

  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status: "DECLINED" },
  });

  await runRotationForJob(offer.jobId);
}

/**
 * MOVE TRADIE TO BOTTOM OF ROTATION
 */
export async function bumpProfessionalToBottom(professionalId: string) {
  await prisma.rotationState.updateMany({
    where: { professionalId },
    data: { lastAssignedAt: new Date() },
  });
}

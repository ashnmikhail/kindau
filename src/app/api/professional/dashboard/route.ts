import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // FIX: auth() must be awaited
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const professional = await prisma.professional.findUnique({
    where: { userId },
    include: {
      jobOffers: {
        where: { status: "PENDING" },
        include: {
          job: {
            include: { subcategory: true, user: true },
          },
        },
      },
      jobAssignments: {
        include: {
          job: {
            include: { subcategory: true, user: true },
          },
        },
      },
      bookings: {
        include: {
          job: {
            include: { subcategory: true, user: true },
          },
        },
      },
    },
  });

  if (!professional) {
    return new Response("Professional not found", { status: 404 });
  }

  return Response.json({
    offers: professional.jobOffers,
    assignments: professional.jobAssignments,
    bookings: professional.bookings,
    profile: {
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      abn: professional.abn,
      businessName: professional.businessName,
      isVerified: professional.isVerified,
      subscriptionStatus: professional.subscriptionStatus,
    },
  });
}

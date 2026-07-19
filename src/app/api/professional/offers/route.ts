import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const professional = await prisma.professional.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
  });

  if (!professional) {
    return NextResponse.json([]);
  }

  const offers = await prisma.jobOffer.findMany({
    where: {
      professionalId: professional.id,
      status: "PENDING",
    },
    include: {
      job: {
        include: {
          subcategory: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(offers);
}
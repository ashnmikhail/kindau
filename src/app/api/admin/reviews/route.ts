import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkId } = await auth();

  // Optional: restrict to admin users
  // If you have an admin flag, enforce it here.
  // For now, we allow any authenticated user.
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        include: {
          subcategory: { include: { category: true } },
        },
      },
      customer: true,
      professional: true,
    },
  });

  return NextResponse.json(reviews);
}

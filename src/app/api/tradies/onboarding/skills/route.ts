import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const selected = form.getAll("subcategoryIds") as string[];

  // Remove existing categories
  await prisma.professionalCategory.deleteMany({
    where: { professionalId: clerkId },
  });

  if (selected.length > 0) {
    // Fetch all selected subcategories so we can get their categoryId
    const subs = await prisma.subcategory.findMany({
      where: { id: { in: selected } },
      select: { id: true, categoryId: true },
    });

    // Insert category rows (unique per category)
    const uniqueCategoryIds = Array.from(
      new Set(subs.map((s) => s.categoryId))
    );

    await prisma.professionalCategory.createMany({
      data: uniqueCategoryIds.map((categoryId) => ({
        professionalId: clerkId,
        categoryId,
      })),
    });
  }

  // Move to next step
  await prisma.professional.update({
    where: { userId: clerkId },
    data: { onboardingStep: 5 },
  });

  return NextResponse.redirect("/tradies/onboarding/service-area");
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const selected = form.getAll("subcategoryIds") as string[];

  // Remove all existing categories
  await prisma.professionalCategory.deleteMany({
    where: { professionalId: clerkId },
  });

  // Add new selected categories
  if (selected.length > 0) {
    await prisma.professionalCategory.createMany({
      data: selected.map((subId) => ({
        professionalId: clerkId,
        subcategoryId: subId,
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

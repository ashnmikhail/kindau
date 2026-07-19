import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.redirect("/sign-in");
  }

  // Ensure professional exists
  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  if (!professional) {
    return NextResponse.redirect("/tradies");
  }

  // Update onboarding step
  await prisma.professional.update({
    where: { userId: clerkId },
    data: { onboardingStep: 2 },
  });

  return NextResponse.redirect("/tradies/onboarding/details");
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  await prisma.professional.update({
    where: { userId: clerkId },
    data: {
      onboardingCompleted: true,
      onboardingStep: 8,
    },
  });

  return NextResponse.redirect("/tradies/onboarding/complete");
}

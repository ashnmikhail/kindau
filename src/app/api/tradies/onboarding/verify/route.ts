import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  // We skip actual uploads for now to unblock the build
  // Later we replace these with real uploaded URLs
  const placeholderLicense = "pending-license";
  const placeholderInsurance = "pending-insurance";
  const placeholderId = "pending-id";

  await prisma.professional.update({
    where: { userId: clerkId },
    data: {
      onboardingStep: 8,
      // temporarily store placeholders
      bio: `License: ${placeholderLicense}, Insurance: ${placeholderInsurance}, ID: ${placeholderId}`,
    },
  });

  return NextResponse.redirect("/tradies/onboarding/complete");
}

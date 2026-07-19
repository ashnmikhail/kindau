import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const abn = form.get("abn") as string;
  const businessName = form.get("businessName") as string;

  await prisma.professional.update({
    where: { userId: clerkId },
    data: {
      abn,
      businessName,
      onboardingStep: 4,
    },
  });

  return NextResponse.redirect("/tradies/onboarding/skills");
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const name = form.get("name") as string;
  const phone = form.get("phone") as string;
  const bio = form.get("bio") as string;

  await prisma.professional.update({
    where: { userId: clerkId },
    data: {
      name,
      phone,
      bio,
      onboardingStep: 3,
    },
  });

  return NextResponse.redirect("/tradies/onboarding/business");
}

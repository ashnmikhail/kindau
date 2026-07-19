import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const areasRaw = form.get("areas") as string;

  const areas = areasRaw
    .split(",")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  // Remove existing service areas
  await prisma.serviceArea.deleteMany({
    where: { professionalId: clerkId },
  });

  // Insert new service areas
  if (areas.length > 0) {
    await prisma.serviceArea.createMany({
      data: areas.map((name) => ({
        professionalId: clerkId,
        name,
      })),
    });
  }

  // Move to next step
  await prisma.professional.update({
    where: { userId: clerkId },
    data: { onboardingStep: 6 },
  });

  return NextResponse.redirect("/tradies/onboarding/availability");
}

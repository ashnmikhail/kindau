import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const raw = form.get("areas") as string;

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Remove existing service areas
  await prisma.serviceArea.deleteMany({
    where: { professionalId: clerkId },
  });

  // Insert new service areas
  for (const line of lines) {
    const parts = line.split(" ").filter((p) => p.length > 0);

    if (parts.length < 3) continue;

    const suburb = parts[0];
    const postcode = parts[1];
    const state = parts.slice(2).join(" "); // handles multi-word states

    await prisma.serviceArea.create({
      data: {
        professionalId: clerkId,
        suburb,
        postcode,
        state,
      },
    });
  }

  // Move to next step
  await prisma.professional.update({
    where: { userId: clerkId },
    data: { onboardingStep: 6 },
  });

  return NextResponse.redirect("/tradies/onboarding/availability");
}

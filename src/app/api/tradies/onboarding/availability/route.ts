import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const form = await req.formData();
  const selectedDays = form.getAll("days") as string[];

  // Remove existing availability
  await prisma.availability.deleteMany({
    where: { professionalId: clerkId },
  });

  // Insert new availability rows
  for (const day of selectedDays) {
    const start = form.get(`${day}-start`) as string;
    const end = form.get(`${day}-end`) as string;

    if (start && end) {
      await prisma.availability.create({
        data: {
          professionalId: clerkId,
          dayOfWeek: DAYS.indexOf(day), // <-- FIXED
          startTime: start,
          endTime: end,
        },
      });
    }
  }

  // Move to next step
  await prisma.professional.update({
    where: { userId: clerkId },
    data: { onboardingStep: 7 },
  });

  return NextResponse.redirect("/tradies/onboarding/verify");
}

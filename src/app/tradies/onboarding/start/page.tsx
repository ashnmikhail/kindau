import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingStartPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // Fetch professional profile
  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  // If no professional exists, redirect to tradies home
  if (!professional) redirect("/tradies");

  // If onboarding already completed → go to verification or dashboard
  if (professional.onboardingCompleted) {
    if (!professional.isVerified) {
      redirect("/tradies/onboarding/verify");
    }
    if (!professional.isActive) {
      redirect("/tradies/onboarding/complete");
    }
    redirect("/tradies"); // fully active
  }

  // If onboarding is in progress → jump to correct step
  switch (professional.onboardingStep) {
    case 1:
      break; // stay on this page
    case 2:
      redirect("/tradies/onboarding/details");
    case 3:
      redirect("/tradies/onboarding/business");
    case 4:
      redirect("/tradies/onboarding/skills");
    case 5:
      redirect("/tradies/onboarding/service-area");
    case 6:
      redirect("/tradies/onboarding/availability");
    case 7:
      redirect("/tradies/onboarding/verify");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Set up your professional profile
      </h1>

      <p className="text-gray-600">
        Before you can start receiving jobs, we need a few details to complete your setup.
      </p>

      <form action="/api/tradies/onboarding/start" method="POST">
        <button
          type="submit"
          className="bg-kindau-teal text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-kindau-orange transition"
        >
          Begin Setup
        </button>
      </form>
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingCompletePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  if (!professional) redirect("/tradies");

  // If onboarding not completed → redirect back
  if (!professional.onboardingCompleted) {
    redirect("/tradies/onboarding/verify");
  }

  // If onboarding completed but not verified → show pending screen
  if (!professional.isVerified) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-kindau-teal">
          Pending Approval
        </h1>

        <p className="text-gray-600">
          Thanks for submitting your documents.  
          Our team is reviewing your information.  
          You’ll be notified once your account is approved.
        </p>

        <div className="mt-6">
          <div className="animate-pulse text-kindau-teal font-semibold">
            Reviewing…
          </div>
        </div>
      </div>
    );
  }

  // If verified but not active → activate tradie
  if (professional.isVerified && !professional.isActive) {
    await prisma.professional.update({
      where: { userId: clerkId },
      data: { isActive: true },
    });

    redirect("/tradies");
  }

  // Fully active → redirect to dashboard
  redirect("/tradies");
}

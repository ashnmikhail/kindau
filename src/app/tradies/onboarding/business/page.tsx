import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingBusinessPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  if (!professional) redirect("/tradies");

  // If onboarding already completed → go to verification or dashboard
  if (professional.onboardingCompleted) {
    if (!professional.isVerified) redirect("/tradies/onboarding/verify");
    if (!professional.isActive) redirect("/tradies/onboarding/complete");
    redirect("/tradies");
  }

  // If user is ahead of this step
  if (professional.onboardingStep > 3) {
    redirect("/tradies/onboarding/skills");
  }

  // If user is behind this step
  if (professional.onboardingStep < 3) {
    redirect("/tradies/onboarding/details");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Business Details
      </h1>

      <p className="text-gray-600">
        Provide your business information. This helps customers trust who they’re hiring.
      </p>

      <form
        action="/api/tradies/onboarding/business"
        method="POST"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">ABN</label>
          <input
            name="abn"
            defaultValue={professional.abn || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input
            name="businessName"
            defaultValue={professional.businessName || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-kindau-teal text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-kindau-orange transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

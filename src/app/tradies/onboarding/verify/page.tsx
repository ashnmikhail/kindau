import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingVerifyPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  if (!professional) redirect("/tradies");

  // If onboarding is already complete
  if (professional.onboardingCompleted) {
    if (!professional.isVerified) redirect("/tradies/onboarding/verify");
    if (!professional.isActive) redirect("/tradies/onboarding/complete");
    redirect("/tradies");
  }

  // If user is ahead of this step
  if (professional.onboardingStep > 7) {
    redirect("/tradies/onboarding/complete");
  }

  // If user is behind this step
  if (professional.onboardingStep < 7) {
    redirect("/tradies/onboarding/availability");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Verification Documents
      </h1>

      <p className="text-gray-600">
        Upload your trade license, insurance, or identity documents.  
        Our team will review and approve your account.
      </p>

      <form
        action="/api/tradies/onboarding/verify"
        method="POST"
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Trade License</label>
          <input
            type="file"
            name="license"
            accept="image/*,application/pdf"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Insurance Document</label>
          <input
            type="file"
            name="insurance"
            accept="image/*,application/pdf"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Photo ID</label>
          <input
            type="file"
            name="id"
            accept="image/*,application/pdf"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-kindau-teal text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-kindau-orange transition"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
}

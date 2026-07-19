import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingDetailsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
  });

  if (!professional) redirect("/tradies");

  // Redirect if user is ahead of this step
  if (professional.onboardingCompleted) {
    if (!professional.isVerified) redirect("/tradies/onboarding/verify");
    if (!professional.isActive) redirect("/tradies/onboarding/complete");
    redirect("/tradies");
  }

  if (professional.onboardingStep > 2) {
    redirect("/tradies/onboarding/business");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Personal Details
      </h1>

      <p className="text-gray-600">
        Tell us a bit about yourself. This helps customers understand who you are.
      </p>

      <form
        action="/api/tradies/onboarding/details"
        method="POST"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            name="name"
            defaultValue={professional.name || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            defaultValue={professional.phone || ""}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            defaultValue={professional.bio || ""}
            className="w-full border rounded px-3 py-2"
            rows={4}
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

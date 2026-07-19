import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingServiceAreaPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
    include: { serviceAreas: true },
  });

  if (!professional) redirect("/tradies");

  // Redirect if onboarding is ahead
  if (professional.onboardingStep > 5) {
    redirect("/tradies/onboarding/availability");
  }

  // Redirect if behind
  if (professional.onboardingStep < 5) {
    redirect("/tradies/onboarding/skills");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Service Areas
      </h1>

      <p className="text-gray-600">
        Add the suburbs or postcodes where you want to receive jobs.
      </p>

      <form
        action="/api/tradies/onboarding/service-area"
        method="POST"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">
            Suburbs / Postcodes (comma separated)
          </label>
          <textarea
            name="areas"
            defaultValue={
              professional.serviceAreas
                .map((a) => a.name)
                .join(", ")
            }
            required
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

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OnboardingSkillsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
    include: { categories: true },
  });

  if (!professional) redirect("/tradies");

  if (professional.onboardingStep > 4) {
    redirect("/tradies/onboarding/service-area");
  }

  if (professional.onboardingStep < 4) {
    redirect("/tradies/onboarding/business");
  }

  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Select Your Skills
      </h1>

      <p className="text-gray-600">
        Choose the types of jobs you want to receive. You can update this anytime.
      </p>

      <form
        action="/api/tradies/onboarding/skills"
        method="POST"
        className="space-y-6"
      >
        {categories.map((cat) => (
          <div key={cat.id} className="border rounded p-4">
            <h2 className="font-semibold text-lg mb-2">{cat.name}</h2>

            <div className="space-y-2">
              {cat.subcategories.map((sub) => (
                <label key={sub.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={cat.id} // ✔ FIXED: submit categoryId
                    defaultChecked={professional.categories.some(
                      (c) => c.categoryId === cat.id
                    )}
                  />
                  <span>{sub.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

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

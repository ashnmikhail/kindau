import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default async function OnboardingAvailabilityPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const professional = await prisma.professional.findUnique({
    where: { userId: clerkId },
    include: { availability: true },
  });

  if (!professional) redirect("/tradies");

  // Redirect if onboarding is ahead
  if (professional.onboardingStep > 6) {
    redirect("/tradies/onboarding/verify");
  }

  // Redirect if behind
  if (professional.onboardingStep < 6) {
    redirect("/tradies/onboarding/service-area");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Weekly Availability
      </h1>

      <p className="text-gray-600">
        Choose the days and times you’re available to work.
      </p>

      <form
        action="/api/tradies/onboarding/availability"
        method="POST"
        className="space-y-6"
      >
        {DAYS.map((day) => {
          const existing = professional.availability.find(
            (a) => a.day === day
          );

          return (
            <div key={day} className="border rounded p-4 space-y-2">
              <h2 className="font-semibold text-lg">{day}</h2>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="days"
                  value={day}
                  defaultChecked={!!existing}
                />
                <span>Available</span>
              </label>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Start</label>
                  <input
                    type="time"
                    name={`${day}-start`}
                    defaultValue={existing?.startTime || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium">End</label>
                  <input
                    type="time"
                    name={`${day}-end`}
                    defaultValue={existing?.endTime || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          );
        })}

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

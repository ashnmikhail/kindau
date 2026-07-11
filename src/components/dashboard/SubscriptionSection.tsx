"use client"

import { format } from "date-fns"

type SubscriptionSectionProps = {
  professional: {
    subscriptionStatus?: string | null
    subscriptionCurrentPeriodEnd?: Date | string | null
  } | null
}

export function SubscriptionSection({ professional }: SubscriptionSectionProps) {
  const status = professional?.subscriptionStatus
  const nextBilling = professional?.subscriptionCurrentPeriodEnd

  const isActive = status === "active"

  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Subscription</h2>

      {isActive ? (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">Active Subscription</p>

          {nextBilling && (
            <p className="text-sm text-gray-600">
              Next billing date:{" "}
              {format(new Date(nextBilling), "dd MMM yyyy")}
            </p>
          )}

          <a
            href="/api/stripe/portal"
            className="inline-block mt-3 px-4 py-2 bg-black text-white rounded-md"
          >
            Manage Billing
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-red-600 font-medium">No Active Subscription</p>

          <a
            href="/subscribe"
            className="inline-block mt-3 px-4 py-2 bg-black text-white rounded-md"
          >
            Subscribe Now
          </a>
        </div>
      )}
    </div>
  )
}

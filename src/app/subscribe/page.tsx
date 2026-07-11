"use client";

export const dynamic = "force-dynamic";

export default function SubscribePage() {
  async function handleSubscribe() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      console.log("Checkout Response:", data);

      if (!res.ok) {
        console.error("Checkout Error:", data);
        alert(JSON.stringify(data));
        return;
      }

      if (!data.url) {
        alert("No checkout URL returned.");
        console.error(data);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout Exception:", err);
      alert("Checkout failed. Check the browser console (F12).");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        {/* Header Section */}
        <div className="bg-kindau-teal px-8 py-10 text-white">
          <h1 className="text-4xl font-bold">
            Join the KindAu Professional Network
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Grow your business with a platform built for skilled professionals.
            No bidding wars. No buying individual leads. Just genuine local job
            opportunities delivered directly to you.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-10 p-8 lg:grid-cols-2">

          {/* Benefits List */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Your Membership Includes
            </h2>

            <div className="space-y-5">

              <div>
                <h3 className="font-semibold text-gray-900">
                  ✔ Receive Quality Job Offers
                </h3>
                <p className="mt-1 text-gray-600">
                  Customers come to KindAu looking for trusted professionals.
                  When a job matches your trade and service area, you'll receive
                  the opportunity directly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  ✔ Fair Job Rotation
                </h3>
                <p className="mt-1 text-gray-600">
                  Our matching system is designed to distribute opportunities
                  fairly among active professionals.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  ✔ Unlimited Opportunities
                </h3>
                <p className="mt-1 text-gray-600">
                  One monthly membership gives you unlimited access to job
                  opportunities—no per-lead charges.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  ✔ Professional Dashboard
                </h3>
                <p className="mt-1 text-gray-600">
                  Manage offers, bookings, customer conversations and your
                  schedule in one place.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  ✔ Build Your Business
                </h3>
                <p className="mt-1 text-gray-600">
                  Receive genuine customer enquiries without competing in a race
                  to the bottom on price.
                </p>
              </div>

            </div>
          </div>

          {/* Pricing Card */}
          <div className="rounded-xl border bg-gray-50 p-8">

            <div className="text-center">

              <h2 className="text-3xl font-bold">$49</h2>

              <p className="mt-2 text-gray-600">
                per month
              </p>

              <div className="mt-8 space-y-3 text-left text-gray-700">

                <p>✓ Unlimited job opportunities</p>
                <p>✓ Customer messaging</p>
                <p>✓ Booking management</p>
                <p>✓ Activity tracking</p>
                <p>✓ Fair rotation system</p>
                <p>✓ Cancel anytime</p>

              </div>

              {/* UPDATED BUTTON */}
              <button
                onClick={handleSubscribe}
                className="mt-10 w-full rounded-lg bg-teal-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-teal-700"
              >
                Start My Membership
              </button>

              <p className="mt-4 text-sm text-gray-500">
                Secure payments powered by Stripe.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

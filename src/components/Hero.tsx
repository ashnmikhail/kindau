import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div>

          <div className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-medium mb-6">
            🇦🇺 Launching Australia Wide
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Australia's Fair
            <br />
            Marketplace For
            <br />
            Customers &
            <br />
            Professionals
          </h1>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-3 mt-6">

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              Fair Pricing
            </span>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Fair Rotation
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              $49/Month
            </span>

          </div>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            Book trusted local professionals with transparent pricing,
            fair job allocation and no costly lead-buying systems.
          </p>

          <p className="mt-4 text-lg font-semibold text-gray-800">
            Fair for customers. Fair for professionals.
          </p>

          <p className="mt-4 text-gray-500 max-w-xl">
            Connecting Australians with trusted local professionals through
            a marketplace built on fairness, transparency and respect.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              href="/book"
              className="rounded-lg bg-black px-6 py-4 font-medium text-white transition hover:opacity-90"
            >
              Book a Job
            </Link>

            <Link
              href="/join"
              className="rounded-lg border border-gray-300 px-6 py-4 font-medium transition hover:bg-gray-50"
            >
              Join as a Professional
            </Link>

          </div>

          {/* TRUST STATEMENT */}
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">

            <span>✓ Transparent Pricing</span>
            <span>✓ Fair Job Allocation</span>
            <span>✓ Australia Wide</span>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">

          <img
            src="/hero-banner.png"
            alt="KindAu Marketplace"
            className="w-full max-w-xl object-contain"
          />

        </div>

      </div>
    </section>
  );
}
import Link from "next/link";

export default function ProfessionalPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Grow Your Business with KindAu
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
          KindAu connects verified Australian professionals with customers
          looking for quality work. We handle the marketing, matching and job
          distribution so you can focus on your trade.
        </p>

        <div className="mt-10">
          <Link
            href="/professional/join"
            className="rounded-lg bg-black px-8 py-4 text-white transition hover:bg-gray-800"
          >
            Become a KindAu Professional
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            Fair Job Distribution
          </h2>

          <p className="mt-3 text-gray-600">
            Jobs are matched through our rotation system, giving subscribed
            professionals a fair opportunity to receive work.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            No Bidding Wars
          </h2>

          <p className="mt-3 text-gray-600">
            Customers don't compare dozens of quotes. KindAu sets transparent
            pricing and connects customers with suitable professionals.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            More Time on the Tools
          </h2>

          <p className="mt-3 text-gray-600">
            Spend less time chasing leads and more time doing paid work while
            KindAu handles customer acquisition.
          </p>
        </div>
      </section>

      <section className="mt-20 rounded-2xl bg-gray-50 p-10 text-center">
        <h2 className="text-3xl font-bold">
          Ready to Join?
        </h2>

        <p className="mt-4 text-gray-600">
          Start your membership today and begin receiving matched job offers in
          your service areas.
        </p>

        <div className="mt-8">
          <Link
            href="/professional/join"
            className="rounded-lg bg-black px-8 py-4 text-white transition hover:bg-gray-800"
          >
            Continue
          </Link>
        </div>
      </section>
    </main>
  );
}
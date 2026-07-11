import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">

        <h2 className="text-4xl font-bold">
          Ready for a Fairer Marketplace?
        </h2>

        <p className="mt-4 text-slate-300">
          Join customers and professionals who believe in fairness,
          transparency and better outcomes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <Link
            href="/book"
            className="rounded-lg bg-white px-6 py-3 font-medium text-black"
          >
            Book a Job
          </Link>

          <Link
            href="/join"
            className="rounded-lg border border-white px-6 py-3 font-medium"
          >
            Join as a Professional
          </Link>

        </div>
      </div>
    </section>
  );
}
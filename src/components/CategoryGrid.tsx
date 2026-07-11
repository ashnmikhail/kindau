"use client";

import Link from "next/link";

interface Category {
  category: string;
  job_count: number;
}

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-3 text-4xl font-bold text-center">
        Popular Services
      </h2>

      <p className="mb-10 text-center text-gray-600 max-w-2xl mx-auto">
        Connect with trusted professionals across Australia's most requested
        trade and home services.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.category}
            href={`/book/${encodeURIComponent(cat.category)}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
          >
            <div className="text-xl font-semibold text-gray-900">
              {cat.category}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Request a quote from trusted professionals
            </div>

            <div className="mt-4 text-sm font-medium text-black group-hover:underline">
              Learn More →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
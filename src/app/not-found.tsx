"use client";
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="p-10 text-center space-y-4">
      <h1 className="text-3xl font-bold text-kindau-teal">Page Not Found</h1>
      <p className="text-kindau-gray">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <a
        href="/"
        className="inline-block mt-4 px-6 py-3 bg-kindau-teal text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
}

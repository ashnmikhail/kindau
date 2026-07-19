"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  if (loading) return <p className="p-6">Loading reviews...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-kindau-teal">
        Customer Reviews
      </h1>

      {reviews.length === 0 && (
        <p className="text-gray-600">No reviews found.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review: any) => (
          <div
            key={review.id}
            className="border rounded-lg p-5 bg-white shadow-sm"
          >
            {/* Rating */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-kindau-teal">
                {review.rating} / 5 ⭐
              </h2>

              <span className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Comment */}
            <p className="mt-2 text-gray-700 leading-relaxed">
              {review.comment || "No comment provided."}
            </p>

            {/* Job Info */}
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm">
              <p>
                <strong>Job:</strong>{" "}
                <Link
                  href={`/admin/jobs/${review.jobId}`}
                  className="text-kindau-teal hover:underline"
                >
                  {review.job?.subcategory?.name}
                </Link>
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {review.job?.subcategory?.category?.name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {review.job?.suburb}, {review.job?.postcode}
              </p>
            </div>

            {/* Customer + Tradie */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 border rounded">
                <p className="font-semibold text-blue-700">Customer</p>
                <p>{review.customer?.firstName} {review.customer?.lastName}</p>
                <p className="text-xs text-blue-700">{review.customer?.email}</p>
              </div>

              <div className="p-3 bg-green-50 border rounded">
                <p className="font-semibold text-green-700">Professional</p>
                <p>{review.professional?.name}</p>
                <p className="text-xs text-green-700">{review.professional?.email}</p>
              </div>
            </div>

            {/* View Job */}
            <Link
              href={`/admin/jobs/${review.jobId}`}
              className="mt-4 inline-block bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition text-sm"
            >
              View Job →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

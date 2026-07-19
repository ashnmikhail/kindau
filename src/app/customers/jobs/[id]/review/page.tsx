"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReviewPage({ params }: PageProps) {
  const router = useRouter();
  
  // Unwraps the asynchronous params using React's use() hook
  const unpackedParams = use(params);
  const jobId = unpackedParams.id;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return;
      try {
        const res = await fetch(`/api/jobs/full?jobId=${jobId}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId]); // Added jobId to dependencies so it triggers once unwrapped

  async function submitReview() {
    setError("");

    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push(`/customers/jobs/${jobId}`);
  }

  if (loading) return <p className="p-4">Loading...</p>;
  if (!job) return <p className="p-4">Job not found.</p>;

  if (job.status !== "COMPLETED") {
    return (
      <div className="p-6">
        <p className="text-red-600">
          You can only review a job after it has been completed.
        </p>
      </div>
    );
  }

  if (job.reviews && job.reviews.length > 0) {
    return (
      <div className="p-6">
        <p className="text-green-700">You have already reviewed this job.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-kindau-teal">
        Leave a Review
      </h1>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">{job.subcategory?.name}</h2>
        <p className="text-gray-700 mt-2">{job.description}</p>
        <p className="text-sm text-gray-600 mt-1">
          Completed on: {new Date(job.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Rating (1–5)
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded px-3 py-2 w-full h-28"
            placeholder="Describe your experience..."
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          onClick={submitReview}
          className="bg-kindau-teal text-white px-4 py-2 rounded hover:bg-kindau-orange transition"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
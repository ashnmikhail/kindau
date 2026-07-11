import Link from "next/link";

type Job = {
  id: string;
  title: string;
  suburb: string;
  price: number;
  photos?: string[];
  status?: string;
};

export default function JobCard({
  job,
}: {
  job: Job;
}) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition"
    >
      <h2 className="text-lg font-semibold">{job.title}</h2>

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{job.suburb}</span>
        <span>${job.price}</span>
      </div>

      {Array.isArray(job.photos) && job.photos.length > 0 && (
        <img
          src={job.photos[0]}
          className="w-full h-40 object-cover rounded-lg mt-3"
        />
      )}
    </Link>
  );
}

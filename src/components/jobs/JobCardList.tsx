import JobCard from "./JobCard";

type Job = {
  id: string;
  title: string;
  suburb: string;
  price: number;
  photos?: string[];
  status?: string;
};

export default function JobCardList({
  jobs,
}: {
  jobs: Job[];
}) {
  return (
    <div
      className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

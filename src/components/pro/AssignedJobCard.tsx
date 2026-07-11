export function AssignedJobCard({ assignment }: any) {
  const job = assignment.job;

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h3 className="font-semibold">{job.subcategory.name}</h3>
      <p>{job.description}</p>
      <p>Customer: {job.user.name}</p>
      <p>Status: {job.status}</p>
    </div>
  );
}

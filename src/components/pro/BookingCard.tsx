export function BookingCard({ booking }: any) {
  const job = booking.job;

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h3 className="font-semibold">{job.subcategory.name}</h3>
      <p>{job.description}</p>
      <p>Customer: {job.user.name}</p>
      <p>Scheduled: {booking.scheduledDate}</p>
    </div>
  );
}

type Job = {
  id: string;
  title: string;
  suburb: string;
  price: number;
  photos?: string[];
  status?: string;
};

export function ConversationHeader({
  job,
}: {
  job: Job;
}) {
  return (
    <div className="border-b p-4 bg-white">
      <h2 className="text-lg font-semibold">Messages</h2>

      <div className="mt-1 text-sm text-gray-600">
        <span className="font-medium">{job.title}</span>
        <span className="ml-2">• {job.suburb}</span>
        <span className="ml-2">• ${job.price}</span>
      </div>
    </div>
  );
}

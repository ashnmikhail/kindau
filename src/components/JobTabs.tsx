"use client";

type Props = {
  job: any;
  activity: any;
  currentUserId: string;
};

export default function Tabs({ job, activity, currentUserId }: Props) {
  return (
    <div className="space-y-4">
      <pre className="text-xs bg-gray-100 p-3 rounded">
        {JSON.stringify({ job, activity, currentUserId }, null, 2)}
      </pre>
    </div>
  );
}

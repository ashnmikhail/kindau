interface JobDetailsCardProps {
  category: string;
  service: string;
  description: string;
  suburb?: string | null;
  postcode?: string | null;
  price?: number | string | null;
  createdAt: Date;
  status: string;
}

const statusColours: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  MATCHING: "bg-blue-100 text-blue-700",
  OFFERED: "bg-indigo-100 text-indigo-700",
  ASSIGNED: "bg-green-100 text-green-700",
  CONTACT_PENDING: "bg-purple-100 text-purple-700",
  BOOKED: "bg-teal-100 text-teal-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function JobDetailsCard({
  category,
  service,
  description,
  suburb,
  postcode,
  price,
  createdAt,
  status,
}: JobDetailsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="border-b px-6 py-5">

        <h2 className="text-xl font-bold">
          Job Details
        </h2>

      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <Info
          title="Category"
          value={category}
        />

        <Info
          title="Service"
          value={service}
        />

        <Info
          title="Location"
          value={`${suburb ?? "-"}, ${postcode ?? "-"}`}
        />

        <Info
          title="Price"
          value={`$${price ?? "TBC"}`}
        />

        <Info
          title="Created"
          value={createdAt.toLocaleString()}
        />

        <div>

          <p className="mb-2 text-sm text-gray-500">
            Status
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              statusColours[status] ??
              "bg-gray-100 text-gray-700"
            }`}
          >
            {status.replaceAll("_", " ")}
          </span>

        </div>

      </div>

      <div className="border-t p-6">

        <p className="mb-2 text-sm text-gray-500">
          Description
        </p>

        <p className="leading-7 text-gray-700 whitespace-pre-wrap">
          {description}
        </p>

      </div>

    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>

      <p className="mb-2 text-sm text-gray-500">
        {title}
      </p>

      <p className="font-medium text-gray-900">
        {value}
      </p>

    </div>
  );
}
import { OfferStatus } from "@prisma/client";

interface Offer {
  id: string;
  status: OfferStatus;
  createdAt: Date;
  professional: {
    name: string;
  };
}

interface OfferHistoryProps {
  offers: Offer[];
}

const statusConfig: Record<
  string,
  {
    icon: string;
    colour: string;
    label: string;
  }
> = {
  PENDING: {
    icon: "🟡",
    colour: "bg-yellow-100 text-yellow-700",
    label: "Pending Response",
  },
  ACCEPTED: {
    icon: "✅",
    colour: "bg-green-100 text-green-700",
    label: "Accepted",
  },
  DECLINED: {
    icon: "❌",
    colour: "bg-red-100 text-red-700",
    label: "Declined",
  },
  EXPIRED: {
    icon: "⌛",
    colour: "bg-gray-100 text-gray-700",
    label: "Expired",
  },
  TIMED_OUT: {
    icon: "⌛",
    colour: "bg-orange-100 text-orange-700",
    label: "Timed Out",
  },
};

export default function OfferHistory({ offers }: OfferHistoryProps) {
  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Matching History</h2>

        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <div className="mb-3 text-4xl">🔍</div>

          <h3 className="font-semibold text-gray-800">
            Matching hasn't started yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            As soon as we begin contacting local professionals, you'll be able
            to see every offer made here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-bold">Matching History</h2>
        <p className="mt-1 text-sm text-gray-500">
          Every professional contacted for your job.
        </p>
      </div>

      <div className="divide-y">
        {offers.map((offer) => {
          const config =
            statusConfig[offer.status] ??
            {
              icon: "📨",
              colour: "bg-gray-100 text-gray-700",
              label: offer.status,
            };

          return (
            <div
              key={offer.id}
              className="flex items-center justify-between px-6 py-5 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kindau-teal/10 text-2xl">
                  {config.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {offer.professional.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {offer.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${config.colour}`}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

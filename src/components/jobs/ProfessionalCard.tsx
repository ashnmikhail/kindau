"use client";

interface Props {
  professional?: {
    name: string;
    businessName?: string | null;
    rating?: number | null;
  };
}

export default function ProfessionalCard({ professional }: Props) {
  if (!professional) return null;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Professional</h2>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-kindau-teal text-white flex items-center justify-center text-2xl font-bold">
          {professional.name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-lg">{professional.name}</p>

          {professional.businessName && (
            <p className="text-gray-500">{professional.businessName}</p>
          )}

          {professional.rating != null && (
            <p className="text-yellow-500 mt-1">
              ★ {professional.rating.toFixed(1)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

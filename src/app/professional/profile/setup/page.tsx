"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

export default function ProfessionalProfileSetupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [abn, setAbn] = useState("");
  const [phone, setPhone] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

  const [serviceAreas, setServiceAreas] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedTrades.length === 0) {
      alert("Please select at least one trade.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/professional/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          abn,
          phone,

          trades: selectedTrades,

          serviceAreas: serviceAreas
            .split(",")
            .map((area) => ({
              suburb: area.trim(),
              postcode: "",
              state: "",
            }))
            .filter((x) => x.suburb.length > 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to save profile.");
        return;
      }

      router.push("/tradies");
    } catch {
      alert("Unable to save profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-xl border bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Complete Your Professional Profile
        </h1>

        <p className="mt-2 text-gray-600">
          You're almost finished. Complete your business profile to begin receiving job opportunities.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >

          <div>
            <label className="font-medium">
              Business Name *
            </label>

            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              ABN / ACN *
            </label>

            <input
              required
              value={abn}
              onChange={(e) => setAbn(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="font-medium">
              Mobile Number *
            </label>

            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>

            <label className="font-medium">
              Trades *
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">

              {categories.map((category) => (

                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                >

                  <input
                    type="checkbox"
                    checked={selectedTrades.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTrades([
                          ...selectedTrades,
                          category.id,
                        ]);
                      } else {
                        setSelectedTrades(
                          selectedTrades.filter(
                            (id) => id !== category.id
                          )
                        );
                      }
                    }}
                  />

                  {category.name}

                </label>

              ))}

            </div>

          </div>

          <div>

            <label className="font-medium">
              Service Areas *
            </label>

            <input
              placeholder="Bondi, Coogee, Randwick"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Separate multiple suburbs with commas.
            </p>

          </div>

          <div>

            <label className="font-medium">
              Company Logo (Optional)
            </label>

            <input
              type="file"
              className="mt-2 w-full"
            />

            <p className="mt-2 text-sm text-gray-500">
              Logo upload will be available soon.
            </p>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>

        </form>

      </div>
    </div>
  );
}
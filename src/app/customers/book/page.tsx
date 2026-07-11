"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

interface Subcategory {
  id: string;
  name: string;
  price: number;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export default function BookJobPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }

    loadCategories();
  }, []);

  const currentCategory = categories.find(
    (c) => c.id === selectedCategory
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus(null);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subcategoryId: selectedSubcategory,
        description,
        suburb,
        postcode,
      }),
    });

    if (res.ok) {
      setStatus("success");
      setDescription("");
      setSuburb("");
      setPostcode("");
      setSelectedCategory("");
      setSelectedSubcategory("");
    } else {
      const error = await res.json();
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Book a Job</h1>

      <p className="mt-2 text-slate-700">
        Tell us what you need done and we'll connect you with a local professional.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <select
          required
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory("");
          }}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="">Select a category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          required
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={!selectedCategory}
        >
          <option value="">Select a service</option>

          {currentCategory?.subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <input
          required
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder="Suburb"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          required
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Postcode"
          className="w-full rounded-md border px-3 py-2"
        />

        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the job"
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700"
        >
          Submit Job
        </button>
      </form>

      {status === "success" && (
        <p className="mt-4 text-emerald-700">
          Job submitted successfully.
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </main>
  );
}

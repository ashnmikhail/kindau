"use client";

import { useState, useEffect } from "react";

interface Subcategory {
  id: string;
  name: string;
  price?: number | null;
}

interface Category {
  id: string;
  name: string;
}

export default function CreateJobPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");

  // Load categories with retry logic
  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch("/api/categories");
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            setLoadingCategories(false);
            return;
          }
        } catch (err) {
          console.error("Category load error:", err);
        }

        // Wait 300ms before retry
        await new Promise((r) => setTimeout(r, 300));
      }

      setLoadingCategories(false);
    }

    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    fetch(`/api/subcategories?categoryId=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data));
  }, [selectedCategory]);

  // Update price when subcategory changes
  useEffect(() => {
    if (!selectedSubcategory) return;
    const sub = subcategories.find((s) => s.id === selectedSubcategory);
    setPrice(sub?.price ?? null);
  }, [selectedSubcategory, subcategories]);

  async function submitJob() {
    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        subcategoryId: selectedSubcategory,
        description,
        suburb,
        postcode,
      }),
    });

    const data = await res.json();
    console.log("Job created:", data);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create a Job</h1>

      {/* Category Dropdown */}
      {loadingCategories ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <select
          className="border p-2 w-full"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory("");
            setPrice(null);
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {/* Subcategory Dropdown */}
      {selectedCategory && (
        <select
          className="border p-2 w-full"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      {/* Price Display */}
      {price !== null && (
        <div className="p-3 bg-gray-100 rounded border">
          <p className="text-lg font-semibold">Price: ${price}</p>
          <p className="text-sm text-gray-600">Materials not included</p>
        </div>
      )}

      {/* Description */}
      <textarea
        className="border p-2 w-full"
        placeholder="Describe the job..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Suburb */}
      <input
        className="border p-2 w-full"
        placeholder="Suburb"
        value={suburb}
        onChange={(e) => setSuburb(e.target.value)}
      />

      {/* Postcode */}
      <input
        className="border p-2 w-full"
        placeholder="Postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />

      {/* Submit */}
      <button
        onClick={submitJob}
        className="bg-black text-white p-3 rounded w-full"
      >
        Create Job
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function SubscribeButton({ professionalId }: { professionalId: string }) {
  const router = useRouter();

  async function handleSubscribe() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professionalId }),
    });

    const data = await res.json();
    if (data.url) router.push(data.url);
  }

  return (
    <button
      onClick={handleSubscribe}
      className="w-full rounded-md bg-black px-4 py-2 text-white"
    >
      Subscribe for $49/month
    </button>
  );
}

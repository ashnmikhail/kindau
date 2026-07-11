"use client";
import { useState, useEffect } from "react";

const testimonials = [
  {
    icon: "👍",
    quote:
      "KindAu changed the way I work. I get steady jobs, fair pay, and customers who actually respect the trade.",
    name: "Michael, Electrician",
  },
  {
    icon: "🔧",
    quote:
      "The rotation system is fair. I don’t have to bid or fight for jobs — the work just comes through evenly.",
    name: "Sarah, Plumber",
  },
  {
    icon: "🪚",
    quote:
      "Payments are smooth, customers are respectful, and the platform actually values tradies.",
    name: "Daniel, Carpenter",
  },
  {
    icon: "🎨",
    quote:
      "I used to waste hours quoting jobs. Now I just accept the work and get on with it.",
    name: "Liam, Painter",
  },
  {
    icon: "🧰",
    quote:
      "KindAu gives me consistent work without the stress of chasing leads or competing with undercutters.",
    name: "Rebecca, Handyman",
  },
  {
    icon: "⚡",
    quote:
      "Instant matching means I’m never sitting around waiting. I finish one job and another is ready.",
    name: "Tom, HVAC Technician",
  },
  {
    icon: "🏠",
    quote:
      "Customers love the transparency. I love the reliability. It’s a win‑win for everyone.",
    name: "Grace, Cleaner",
  },
];

export function RotatingTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // rotates every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const t = testimonials[index];

  return (
    <div className="bg-gray-50 rounded-2xl p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-opacity duration-500">
      <div className="h-24 w-24 rounded-full bg-kindau-teal/10 flex items-center justify-center text-4xl text-kindau-teal">
        {t.icon}
      </div>

      <div className="max-w-2xl">
        <p className="text-xl italic leading-relaxed">{`“${t.quote}”`}</p>
        <span className="block mt-3 font-semibold text-kindau-teal">
          — {t.name}
        </span>
      </div>
    </div>
  );
}

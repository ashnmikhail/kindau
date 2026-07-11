"use client";

import Hero from "../components/Hero";
import Footer from "../components/Footer";
import CategoryGrid from "../components/CategoryGrid";
import WhyKindAu from "../components/WhyKindAu";
import ForProfessionals from "../components/ForProfessionals";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";
import { RotatingTestimonials } from "../components/RotatingTestimonials";

const categories = [
  { category: "Electrical", job_count: 0 },
  { category: "Plumbing", job_count: 0 },
  { category: "Cleaning", job_count: 0 },
  { category: "Handyman", job_count: 0 },
  { category: "Painting", job_count: 0 },
  { category: "Gardening", job_count: 0 },
  { category: "Carpentry", job_count: 0 },
  { category: "Roofing", job_count: 0 },

  { category: "Air Conditioning", job_count: 0 },
  { category: "Pest Control", job_count: 0 },
  { category: "Pressure Cleaning", job_count: 0 },
  { category: "Landscaping", job_count: 0 },

  { category: "Tiling", job_count: 0 },
  { category: "Flooring", job_count: 0 },
  { category: "Fencing", job_count: 0 },
  { category: "Removalists", job_count: 0 },
];

export default function Home() {
  return (
    <>
      <Hero />

      <WhyKindAu />

      <ForProfessionals />

      <CategoryGrid categories={categories} />

      <HowItWorks />

      <RotatingTestimonials />

      <FinalCTA />

      <Footer />
    </>
  );
}
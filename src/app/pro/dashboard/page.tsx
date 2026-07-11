"use client";

import { useEffect, useState } from "react";

import { OfferCard } from "@/components/pro/OfferCard";
import { AssignedJobCard } from "@/components/pro/AssignedJobCard";
import { BookingCard } from "@/components/pro/BookingCard";

export default function ProDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/professional/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Professional Dashboard</h1>

      {/* Pending Offers */}
      <section>
        <h2 className="text-xl font-semibold">Pending Offers</h2>
        {data.offers.length === 0 && <p>No pending offers.</p>}
        {data.offers.map((offer: any) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </section>

      {/* Assigned Jobs */}
      <section>
        <h2 className="text-xl font-semibold">Assigned Jobs</h2>
        {data.assignments.length === 0 && <p>No assigned jobs.</p>}
        {data.assignments.map((assignment: any) => (
          <AssignedJobCard key={assignment.id} assignment={assignment} />
        ))}
      </section>

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
        {data.bookings.length === 0 && <p>No upcoming bookings.</p>}
        {data.bookings.map((booking: any) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </section>
    </div>
  );
}

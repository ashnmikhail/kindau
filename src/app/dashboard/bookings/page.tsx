"use client"

import { useEffect, useState } from "react"
import BookingCard from "./BookingCard"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bookings/customer")
      const data = await res.json()
      setBookings(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-6">Loading bookings...</div>

  if (bookings.length === 0)
    return <div className="p-6">No pending bookings.</div>

  return (
    <div className="p-6 space-y-4">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  )
}

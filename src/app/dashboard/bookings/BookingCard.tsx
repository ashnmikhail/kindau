"use client"

export default function BookingCard({ booking }: { booking: any }) {
  async function confirm() {
    await fetch("/api/bookings/confirm", {
      method: "POST",
      body: JSON.stringify({ bookingId: booking.id }),
    })
    location.reload()
  }

  async function decline() {
    await fetch("/api/bookings/decline", {
      method: "POST",
      body: JSON.stringify({ bookingId: booking.id }),
    })
    location.reload()
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">
        {booking.job.subcategory.category.name} — {booking.job.subcategory.name}
      </h2>

      <p className="text-gray-600">
        Scheduled: {new Date(booking.scheduledDate).toLocaleString()}
      </p>

      <p className="text-gray-600">
        Tradie: {booking.professional.name}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={confirm}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Confirm
        </button>

        <button
          onClick={decline}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

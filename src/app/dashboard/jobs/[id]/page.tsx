"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function JobDetailsPage() {
  const { id } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/jobs/${id}`)
      const data = await res.json()
      setJob(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="p-6">Loading job...</div>

  if (!job || job.error)
    return <div className="p-6 text-red-600">Job not found.</div>

  return (
    <div className="p-6 space-y-6">
      <Header job={job} />
      <CustomerInfo job={job} />
      <BookingInfo job={job} />
      <Conversation job={job} />
    </div>
  )
}

function Header({ job }: { job: any }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        {job.subcategory.category.name} — {job.subcategory.name}
      </h1>
      <p className="text-gray-600 mt-1">Suburb: {job.suburb}</p>
      <p className="text-gray-600 mt-1">{job.description}</p>
      <p className="text-sm text-gray-500 mt-2">Status: {job.status}</p>
    </div>
  )
}

function CustomerInfo({ job }: { job: any }) {
  const user = job.user

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Customer</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  )
}

function BookingInfo({ job }: { job: any }) {
  const booking = job.booking

  if (!booking)
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Booking</h2>
        <p>No booking yet.</p>
      </div>
    )

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Booking</h2>
      <p>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
      <p>Status: {booking.status}</p>
    </div>
  )
}

function Conversation({ job }: { job: any }) {
  const convo = job.conversation

  if (!convo)
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <p>No conversation yet.</p>
      </div>
    )

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Messages</h2>
      <div className="space-y-2">
        {convo.messages.map((msg: any) => (
          <div key={msg.id} className="p-2 border rounded-md">
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

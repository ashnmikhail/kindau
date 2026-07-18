"use client"

import { useEffect, useState } from "react"

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/offers")
      const data = await res.json()
      setOffers(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-6">Loading offers...</div>

  if (offers.length === 0)
    return <div className="p-6 text-gray-500">No active offers right now.</div>

  return (
    <div className="p-6 space-y-4">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
}

function OfferCard({ offer }: { offer: any }) {
  const job = offer.job

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">
        {job.subcategory.category.name} — {job.subcategory.name}
      </h2>

      <p className="text-gray-600 mt-1">Suburb: {job.suburb}</p>
      <p className="text-gray-600 mt-1">{job.description}</p>

      <div className="flex gap-3 mt-4">
        <AcceptButton offerId={offer.id} />
        <DeclineButton offerId={offer.id} />
      </div>
    </div>
  )
}

function AcceptButton({ offerId }: { offerId: string }) {
  async function accept() {
    await fetch("/api/offers/accept", {
      method: "POST",
      body: JSON.stringify({ offerId }),
    })
    location.reload()
  }

  return (
    <button
      onClick={accept}
      className="px-4 py-2 bg-green-600 text-white rounded-md"
    >
      Accept
    </button>
  )
}

function DeclineButton({ offerId }: { offerId: string }) {
  async function decline() {
    await fetch("/api/offers/decline", {
      method: "POST",
      body: JSON.stringify({ offerId }),
    })
    location.reload()
  }

  return (
    <button
      onClick={decline}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Decline
    </button>
  )
}

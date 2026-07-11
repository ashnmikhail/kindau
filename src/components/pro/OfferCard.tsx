export function OfferCard({ offer }: any) {
  const accept = () =>
    fetch(`/api/offers/${offer.id}/accept`, { method: "POST" });

  const decline = () =>
    fetch(`/api/offers/${offer.id}/decline`, { method: "POST" });

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h3 className="font-semibold">{offer.job.subcategory.name}</h3>
      <p>{offer.job.description}</p>
      <p>Customer: {offer.job.user.name}</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={accept}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export function useOffers() {
  async function getOffers(professionalId: string) {
    return fetch('/api/offers/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId })
    }).then(r => r.json())
  }

  async function respondToOffer(offerId: string, action: 'accept' | 'decline') {
    return fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, action })
    }).then(r => r.json())
  }

  return { getOffers, respondToOffer }
}

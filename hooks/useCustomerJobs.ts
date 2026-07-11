export function useCustomerJobs() {
  async function getJobs(customerId: string) {
    return fetch('/api/jobs/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId })
    }).then(r => r.json())
  }

  return { getJobs }
}

export function useCreateJob() {
  async function createJob(data: {
    customerId: string
    subcategoryId: string
    description: string
    address?: string
    postcode?: string
    suburb?: string
  }) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      throw new Error('Failed to create job')
    }

    return res.json()
  }

  return { createJob }
}

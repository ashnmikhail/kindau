export function useMatchProfessionals() {
  async function match(jobId: string) {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    })

    if (!res.ok) throw new Error('Failed to match professionals')

    return res.json()
  }

  return { match }
}

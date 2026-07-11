export function useProfessionalOnboarding() {
  async function createProfile(data: any) {
    return fetch('/api/professionals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json())
  }

  async function updateCategories(professionalId: string, categoryIds: string[]) {
    return fetch('/api/professionals/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId, categoryIds })
    }).then(r => r.json())
  }

  async function updateServiceAreas(professionalId: string, areas: any[]) {
    return fetch('/api/professionals/service-areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId, areas })
    }).then(r => r.json())
  }

  async function updateAvailability(professionalId: string, slots: any[]) {
    return fetch('/api/professionals/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId, slots })
    }).then(r => r.json())
  }

  return {
    createProfile,
    updateCategories,
    updateServiceAreas,
    updateAvailability
  }
}

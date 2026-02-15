import { InviteUserInput, ManagedUser } from '@/modules/users/users.types'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data as T
}

export async function getUsers(companyId: string): Promise<ManagedUser[]> {
  const data = await request<{ users: ManagedUser[] }>(`/api/users/manage?company_id=${companyId}`)
  return data.users || []
}

export async function inviteUser(payload: InviteUserInput) {
  await request('/api/users/manage', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateUserRole(user_id: string, role: string, warehouse_ids: string[]) {
  await request('/api/users/manage', { method: 'PATCH', body: JSON.stringify({ user_id, role, warehouse_ids }) })
}

export async function removeUser(user_id: string) {
  await request('/api/users/manage', { method: 'DELETE', body: JSON.stringify({ user_id }) })
}

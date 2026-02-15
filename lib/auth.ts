export const normalizeRole = (role?: string | null) => (role || '').toLowerCase()

export const isOwnerRole = (role?: string | null) => {
  const normalized = normalizeRole(role)
  return normalized === 'owner' || normalized === 'ceo'
}

export const isManagerRole = (role?: string | null) => normalizeRole(role) === 'manager'
export const isSalesRole = (role?: string | null) => normalizeRole(role) === 'sales'

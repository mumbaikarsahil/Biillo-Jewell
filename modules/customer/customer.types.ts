export interface Customer {
  id: string
  company_id: string
  full_name: string
  phone: string
  email: string | null
  city: string | null
  birth_date: string | null
  anniversary_date: string | null
  notes: string | null
  created_at: string
}

export interface CustomerInput {
  full_name: string
  phone: string
  email?: string
  city?: string
  birth_date?: string
  anniversary_date?: string
  notes?: string
}

export interface Karigar {
  id: string
  company_id: string
  karigar_code: string
  full_name: string
  phone: string | null
  specialization: string | null
  labor_type: 'PER_GRAM' | 'FIXED'
  default_labor_rate: number | null
  is_active: boolean
}

export interface KarigarInput {
  karigar_code: string
  full_name: string
  phone?: string
  specialization?: string
  labor_type: Karigar['labor_type']
  default_labor_rate?: number
}

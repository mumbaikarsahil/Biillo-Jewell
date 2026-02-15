export interface Company {
  id: string
  legal_name: string
  trade_name: string | null
  company_code: string
  pan_number: string | null
  gstin: string | null
  cin_number: string | null
  logo_url: string | null
  status: 'active' | 'inactive' | 'archived'
  created_at: string
}

export interface CompanyInput {
  legal_name: string
  trade_name?: string
  company_code: string
  pan_number?: string
  gstin?: string
  cin_number?: string
  logo_url?: string
  status: Company['status']
}

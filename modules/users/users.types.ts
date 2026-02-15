export interface ManagedUser {
  user_id: string
  email: string | null
  role: string
  company_id: string
  warehouses: string[]
}

export interface InviteUserInput {
  email: string
  role: string
  company_id: string
  warehouse_ids: string[]
}

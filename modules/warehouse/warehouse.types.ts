export interface Warehouse {
  id: string
  company_id: string
  warehouse_code: string
  name: string
  warehouse_type: 'main_safe' | 'factory' | 'branch' | 'transit'
  is_active: boolean
  created_at: string
}

export interface WarehouseInput {
  warehouse_code: string
  name: string
  warehouse_type: Warehouse['warehouse_type']
}

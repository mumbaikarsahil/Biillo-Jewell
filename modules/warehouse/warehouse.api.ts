import { supabase } from '@/lib/supabaseClient'
import { Warehouse, WarehouseInput } from '@/modules/warehouse/warehouse.types'

export async function getWarehouses(companyId: string): Promise<Warehouse[]> {
  const { data, error } = await supabase.from('warehouses').select('*').eq('company_id', companyId).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as Warehouse[]
}

export async function createWarehouse(companyId: string, payload: WarehouseInput) {
  const { error } = await supabase.from('warehouses').insert({ ...payload, company_id: companyId })
  if (error) throw error
}

export async function updateWarehouse(id: string, payload: Partial<WarehouseInput>) {
  const { error } = await supabase.from('warehouses').update(payload).eq('id', id)
  if (error) throw error
}

export async function deactivateWarehouse(id: string, isActive: boolean) {
  const { error } = await supabase.from('warehouses').update({ is_active: !isActive }).eq('id', id)
  if (error) throw error
}

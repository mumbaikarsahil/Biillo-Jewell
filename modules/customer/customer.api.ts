import { supabase } from '@/lib/supabaseClient'
import { Customer, CustomerInput } from '@/modules/customer/customer.types'

export async function getCustomers(companyId: string): Promise<Customer[]> {
  const { data, error } = await supabase.from('customers').select('*').eq('company_id', companyId).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as Customer[]
}

export async function createCustomer(companyId: string, payload: CustomerInput) {
  const { error } = await supabase.from('customers').insert({ ...payload, company_id: companyId })
  if (error) throw error
}

export async function updateCustomer(id: string, payload: Partial<CustomerInput>) {
  const { error } = await supabase.from('customers').update(payload).eq('id', id)
  if (error) throw error
}

export async function deactivateCustomer(customer: Customer) {
  const note = customer.notes?.includes('[INACTIVE]') ? customer.notes : `[INACTIVE] ${customer.notes || ''}`.trim()
  await updateCustomer(customer.id, { notes: note })
}

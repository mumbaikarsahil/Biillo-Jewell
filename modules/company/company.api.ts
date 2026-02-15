import { supabase } from '@/lib/supabaseClient'
import { Company, CompanyInput } from '@/modules/company/company.types'

export async function getCompanies(companyId: string): Promise<Company[]> {
  const { data, error } = await supabase.from('companies').select('*').eq('id', companyId)
  if (error) throw error
  return (data || []) as Company[]
}

export async function createCompany(companyId: string, payload: CompanyInput) {
  const { error } = await supabase.from('companies').upsert({ id: companyId, ...payload })
  if (error) throw error
}

export async function updateCompany(companyId: string, payload: Partial<CompanyInput>) {
  const { error } = await supabase.from('companies').update(payload).eq('id', companyId)
  if (error) throw error
}

export async function deactivateCompany(companyId: string) {
  await updateCompany(companyId, { status: 'inactive' })
}

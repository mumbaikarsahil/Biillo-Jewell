import { supabase } from '@/lib/supabaseClient'
import { Karigar, KarigarInput } from '@/modules/karigar/karigar.types'

export async function getKarigars(companyId: string): Promise<Karigar[]> {
  const { data, error } = await supabase.from('karigars').select('*').eq('company_id', companyId).order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as Karigar[]
}

export async function createKarigar(companyId: string, payload: KarigarInput) {
  const { error } = await supabase.from('karigars').insert({ ...payload, company_id: companyId })
  if (error) throw error
}

export async function updateKarigar(id: string, payload: Partial<KarigarInput>) {
  const { error } = await supabase.from('karigars').update(payload).eq('id', id)
  if (error) throw error
}

export async function deactivateKarigar(id: string, isActive: boolean) {
  const { error } = await supabase.from('karigars').update({ is_active: !isActive }).eq('id', id)
  if (error) throw error
}

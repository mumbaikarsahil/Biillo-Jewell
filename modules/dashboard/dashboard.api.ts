import { supabase } from '@/lib/supabaseClient'

async function selectSingle(view: string) {
  const { data, error } = await supabase.from(view).select('*').single()
  if (error) throw error
  return data
}

async function selectMany(view: string) {
  const { data, error } = await supabase.from(view).select('*')
  if (error) throw error
  return data || []
}

export async function getSalesDashboardData() {
  const [storeKpi, memoStatus] = await Promise.all([
    selectSingle('v_store_kpi'),
    selectSingle('v_memo_status'),
  ])

  return {
    storeKpi,
    memoStatus,
  }
}

export async function getManagerDashboardData() {
  const [inventorySummary, transferStatus, memoStatus, storeKpi] = await Promise.all([
    selectSingle('v_manager_inventory_summary'),
    selectMany('v_transfer_status'),
    selectSingle('v_memo_status'),
    selectMany('v_store_kpi'),
  ])

  return {
    inventorySummary,
    transferStatus,
    memoStatus,
    storeKpi,
  }
}

export async function getOwnerDashboardData() {
  const [financialSummary, goldExposure, diamondExposure, transferStatus, memoStatus] = await Promise.all([
    selectSingle('v_owner_financial_summary'),
    selectSingle('v_owner_gold_exposure'),
    selectSingle('v_owner_diamond_exposure'),
    selectMany('v_transfer_status'),
    selectSingle('v_memo_status'),
  ])

  return {
    financialSummary,
    goldExposure,
    diamondExposure,
    transferStatus,
    memoStatus,
  }
}

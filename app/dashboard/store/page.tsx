'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/layout/AppLayout'
import DashboardCard from '@/components/dashboard/Card'
import { Loader2 } from 'lucide-react'

interface StoreStat {
  total_sales?: number
  invoice_count?: number
}

export default function StoreDashboard() {
  const [stats, setStats] = useState<StoreStat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data } = await supabase
        .from('v_store_today_sales')
        .select('*')
        .single()

      if (data) {
        setStats(data)
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Store Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Today's Sales"
            value={`₹${stats?.total_sales || 0}`}
            subtitle="Total revenue"
          />
          <DashboardCard
            title="Invoices"
            value={stats?.invoice_count || 0}
            subtitle="Transactions today"
          />
          <DashboardCard
            title="Average Order Value"
            value={`₹${
              stats?.invoice_count && stats?.total_sales
                ? (stats.total_sales / stats.invoice_count).toFixed(0)
                : 0
            }`}
            subtitle="Per transaction"
          />
        </div>
      </div>
    </AppLayout>
  )
}

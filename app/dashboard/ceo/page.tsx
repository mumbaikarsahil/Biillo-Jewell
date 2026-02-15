'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/layout/AppLayout'
import DashboardCard from '@/components/dashboard/Card'
import { Loader2 } from 'lucide-react'

interface OwnerStats {
  total_value: number
}

export default function CEODashboard() {
  const [data, setData] = useState<OwnerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: result } = await supabase
        .from('v_owner_inventory_value')
        .select('*')
        .single()

      if (result) {
        setData(result as OwnerStats)
      }
    } catch (err) {
      console.error('Error loading data:', err)
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
        <h1 className="text-3xl font-bold mb-8">CEO Dashboard</h1>

        <DashboardCard
          title="Total Inventory Value"
          value={`₹${data?.total_value || 0}`}
          subtitle="Across all warehouses"
        />
      </div>
    </AppLayout>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BranchStats {
  warehouse_id: string
  branch_name: string
  total_sales: number
  invoice_count: number
}

export default function ManagerDashboard() {
  const [branches, setBranches] = useState<BranchStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const { data } = await supabase
        .from('v_manager_branch_summary')
        .select('*')

      if (data) {
        setBranches(data as BranchStats[])
      }
    } catch (err) {
      console.error('Error loading branches:', err)
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
        <h1 className="text-3xl font-bold mb-8">Manager Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <Card key={branch.warehouse_id} className="p-6">
              <h3 className="font-bold text-lg mb-4">{branch.branch_name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-semibold">₹{branch.total_sales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoices</span>
                  <span className="font-semibold">{branch.invoice_count}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

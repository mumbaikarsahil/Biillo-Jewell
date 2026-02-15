'use client'

import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { getManagerDashboardData, getOwnerDashboardData, getSalesDashboardData } from '@/modules/dashboard/dashboard.api'
import { SalesDashboard } from '@/modules/dashboard/SalesDashboard'
import { ManagerDashboard } from '@/modules/dashboard/ManagerDashboard'
import { OwnerDashboard } from '@/modules/dashboard/OwnerDashboard'
import { QuickAccessBar } from '@/modules/dashboard/QuickAccessBar'
import { DashboardSidebar } from '@/modules/dashboard/DashboardSidebar'

type DashboardRole = 'sales' | 'manager' | 'owner'

const dashboardMap = {
  sales: SalesDashboard,
  manager: ManagerDashboard,
  owner: OwnerDashboard,
} as const

function getDashboardRole(role?: string | null): DashboardRole | null {
  const normalized = (role || '').toLowerCase()
  if (normalized === 'sales') return 'sales'
  if (normalized === 'manager') return 'manager'
  if (normalized === 'owner' || normalized === 'ceo') return 'owner'
  return null
}

export default function DashboardPage() {
  const { appUser, displayName } = useAuth()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const dashboardRole = useMemo(() => getDashboardRole(appUser?.role), [appUser?.role])

  useEffect(() => {
    if (!dashboardRole) {
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        if (dashboardRole === 'sales') {
          setData(await getSalesDashboardData())
        } else if (dashboardRole === 'manager') {
          setData(await getManagerDashboardData())
        } else {
          setData(await getOwnerDashboardData())
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [dashboardRole])

  const DashboardComponent = dashboardRole ? dashboardMap[dashboardRole] : null

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">{displayName} • {appUser?.role || 'unknown role'}</p>
          </div>
          <Card className="rounded-2xl px-4 py-3 border shadow-sm">
            <p className="text-xs text-gray-500">Current View</p>
            <p className="font-semibold capitalize">{dashboardRole || 'No mapped role'}</p>
          </Card>
        </div>

        <QuickAccessBar />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <div className="xl:col-span-1">
            <DashboardSidebar />
          </div>
          <div className="xl:col-span-3">
            {loading ? (
              <Card className="p-6 rounded-2xl">Loading dashboard...</Card>
            ) : error ? (
              <Card className="p-6 rounded-2xl text-red-600">{error}</Card>
            ) : !DashboardComponent ? (
              <Card className="p-6 rounded-2xl">No dashboard is configured for your role.</Card>
            ) : (
              <DashboardComponent data={data} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

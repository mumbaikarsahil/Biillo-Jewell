'use client'

import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { getManagerDashboardData, getOwnerDashboardData, getSalesDashboardData } from '@/modules/dashboard/dashboard.api'
import { SalesDashboard } from '@/modules/dashboard/SalesDashboard'
import { ManagerDashboard } from '@/modules/dashboard/ManagerDashboard'
import { OwnerDashboard } from '@/modules/dashboard/OwnerDashboard'

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
          return
        }
        if (dashboardRole === 'manager') {
          setData(await getManagerDashboardData())
          return
        }
        setData(await getOwnerDashboardData())
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">{displayName} • {appUser?.role || 'unknown role'}</p>
        </div>

        {loading ? (
          <Card className="p-6">Loading dashboard...</Card>
        ) : error ? (
          <Card className="p-6 text-red-600">{error}</Card>
        ) : !DashboardComponent ? (
          <Card className="p-6">No dashboard is configured for your role.</Card>
        ) : (
          <DashboardComponent data={data} />
        )}
      </div>
    </AppLayout>
  )
}

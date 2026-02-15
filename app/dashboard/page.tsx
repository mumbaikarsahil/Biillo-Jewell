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
import { Button } from '@/components/ui/button'
import { BarChart3, Gem, HandCoins, Package, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { appUser, displayName } = useAuth()

  const menuItems = [
    {
      title: 'Point of Sale',
      description: 'Create new sales transactions',
      icon: <ShoppingCart className="w-8 h-8" />,
      href: '/pos',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Scan Items',
      description: 'Barcode lookup and validation',
      icon: <Package className="w-8 h-8" />,
      href: '/scan',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Inventory',
      description: 'Serialized stock by warehouse and status',
      icon: <Gem className="w-8 h-8" />,
      href: '/inventory',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Transfers',
      description: 'HO / branch custody transfer operations',
      icon: <HandCoins className="w-8 h-8" />,
      href: '/transfers',
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      title: 'Manufacturing',
      description: 'Job bag production monitoring',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/manufacturing',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'CRM',
      description: 'Customers, leads and follow-ups',
      icon: <Users className="w-8 h-8" />,
      href: '/crm',
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-600 mb-8">
          {appUser ? `${displayName} • ${appUser.role}` : 'Loading...'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className={`${item.color} rounded-lg p-3 w-fit mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Card>
            </Link>
          ))}
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

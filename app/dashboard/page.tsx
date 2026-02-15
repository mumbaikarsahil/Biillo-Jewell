'use client'

import { useAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, ClipboardList, Gem, HandCoins, Package, ShoppingCart, Users } from 'lucide-react'
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
      title: 'Operations Center',
      description: 'All ERP forms organized by process level',
      icon: <ClipboardList className="w-8 h-8" />,
      href: '/operations',
      color: 'bg-slate-100 text-slate-700',
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

        {appUser?.role === 'ceo' && (
          <Card className="mt-8 p-6 bg-amber-50 border-amber-200">
            <h3 className="font-bold text-lg mb-4">Executive Dashboard</h3>
            <Button asChild>
              <Link href="/dashboard/ceo">
                View CEO Dashboard
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

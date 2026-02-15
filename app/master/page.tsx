'use client'

import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { useRBAC } from '@/hooks/useRBAC'

const modules = [
  { id: 'company', label: 'Company Setup', href: '/master/company' },
  { id: 'warehouse', label: 'Warehouse Management', href: '/master/warehouse' },
  { id: 'users', label: 'User Role Mapping', href: '/master/users' },
  { id: 'karigar', label: 'Karigar Master', href: '/master/karigar' },
  { id: 'customer', label: 'Customer Master', href: '/master/customer' },
] as const

export default function MasterHomePage() {
  const { canAccessMasterModule } = useRBAC()

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Master Setup</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {modules.filter(item => canAccessMasterModule(item.id)).map(item => (
            <Link key={item.id} href={item.href}>
              <Card className="p-5 hover:shadow-md">
                <h2 className="font-semibold">{item.label}</h2>
                <p className="text-sm text-gray-600 mt-1">Open module</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

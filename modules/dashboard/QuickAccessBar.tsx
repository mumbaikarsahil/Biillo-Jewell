'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'

const quickLinks = [
  { label: 'New Sale', href: '/pos' },
  { label: 'Scan Item', href: '/scan' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'CRM', href: '/crm' },
]

export function QuickAccessBar() {
  return (
    <Card className="rounded-2xl p-4 border shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-3">Quick Access</p>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {quickLinks.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border px-3 py-2 text-sm font-medium text-center bg-white hover:bg-gray-50"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </Card>
  )
}

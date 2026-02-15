'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'

const sections = [
  {
    title: 'Sales Operations',
    links: [
      { label: 'POS', href: '/pos' },
      { label: 'Scanner', href: '/scan' },
      { label: 'CRM', href: '/crm' },
    ],
  },
  {
    title: 'Stock Control',
    links: [
      { label: 'Inventory', href: '/inventory' },
      { label: 'Transfers', href: '/transfers' },
      { label: 'Manufacturing', href: '/manufacturing' },
    ],
  },
  {
    title: 'Master Setup',
    links: [
      { label: 'Master Home', href: '/master' },
      { label: 'Companies', href: '/master/company' },
      { label: 'Warehouses', href: '/master/warehouse' },
      { label: 'Users & Roles', href: '/master/users' },
      { label: 'Karigars', href: '/master/karigar' },
      { label: 'Customers', href: '/master/customer' },
    ],
  },
]

export function DashboardSidebar() {
  return (
    <Card className="rounded-2xl p-4 border shadow-sm sticky top-28">
      <h2 className="font-semibold text-gray-900 mb-4">Navigation</h2>
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">{section.title}</p>
            <div className="flex flex-col gap-1">
              {section.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

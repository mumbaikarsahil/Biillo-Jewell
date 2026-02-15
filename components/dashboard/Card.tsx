'use client'

import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value?: string | number
  subtitle?: string
  icon?: ReactNode
  children?: ReactNode
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  children,
}: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {value && <p className="text-2xl font-bold mt-2">{value}</p>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {children}
    </div>
  )
}

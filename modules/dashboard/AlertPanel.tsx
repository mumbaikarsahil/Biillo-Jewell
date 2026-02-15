'use client'

import { Card } from '@/components/ui/card'

interface AlertItem {
  label: string
  value: string | number
}

interface Props {
  title: string
  items: AlertItem[]
}

export function AlertPanel({ title, items }: Props) {
  return (
    <Card className="rounded-2xl shadow-sm border p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

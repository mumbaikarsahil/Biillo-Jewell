'use client'

import { Card } from '@/components/ui/card'

interface KPIItem {
  label: string
  value: string | number
  helper?: string
}

interface Props {
  items: KPIItem[]
}

export function KPIGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map(item => (
        <Card key={item.label} className="p-5 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-semibold mt-1">{item.value}</p>
          {item.helper ? <p className="text-xs text-gray-500 mt-1">{item.helper}</p> : null}
        </Card>
      ))}
    </div>
  )
}

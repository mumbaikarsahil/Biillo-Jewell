'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

interface Props<T> {
  title: string
  rows: T[]
  columns: Column<T>[]
  emptyLabel?: string
}

export function DashboardDataTable<T>({ title, rows, columns, emptyLabel = 'No data' }: Props<T>) {
  return (
    <Card className="rounded-2xl shadow-sm border overflow-x-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map(col => (
              <th key={col.key} className="text-left p-3 font-medium text-gray-600">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-none">
              {columns.map(col => (
                <td key={`${col.key}-${index}`} className="p-3">{col.render(row)}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-gray-500" colSpan={columns.length}>{emptyLabel}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  )
}

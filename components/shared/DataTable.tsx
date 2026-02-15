'use client'

import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  rows: T[]
  columns: Column<T>[]
  emptyLabel: string
}

export function DataTable<T>({ rows, columns, emptyLabel }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            {columns.map(column => (
              <th key={column.key} className="text-left p-3 font-semibold text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-none">
              {columns.map(column => (
                <td key={`${column.key}-${index}`} className="p-3 align-top">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-gray-500" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

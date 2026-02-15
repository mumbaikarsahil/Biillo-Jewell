'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Warehouse } from '@/modules/warehouse/warehouse.types'

interface Props {
  rows: Warehouse[]
  onEdit: (row: Warehouse) => void
  onToggle: (row: Warehouse) => void
}

export function WarehouseTable({ rows, onEdit, onToggle }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyLabel="No warehouse found"
      columns={[
        { key: 'name', header: 'Name', render: row => row.name },
        { key: 'code', header: 'Code', render: row => row.warehouse_code },
        { key: 'type', header: 'Type', render: row => row.warehouse_type },
        { key: 'active', header: 'Active', render: row => (row.is_active ? 'Yes' : 'No') },
        { key: 'actions', header: 'Actions', render: row => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => onEdit(row)}>Edit</Button><Button size="sm" variant="outline" onClick={() => onToggle(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</Button></div> },
      ]}
    />
  )
}

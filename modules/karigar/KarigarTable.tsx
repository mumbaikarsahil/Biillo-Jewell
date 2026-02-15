'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Karigar } from '@/modules/karigar/karigar.types'

interface Props {
  rows: Karigar[]
  onEdit: (row: Karigar) => void
  onToggle: (row: Karigar) => void
}

export function KarigarTable({ rows, onEdit, onToggle }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyLabel="No karigar found"
      columns={[
        { key: 'code', header: 'Code', render: row => row.karigar_code },
        { key: 'name', header: 'Name', render: row => row.full_name },
        { key: 'phone', header: 'Phone', render: row => row.phone || '-' },
        { key: 'type', header: 'Labor Type', render: row => row.labor_type },
        { key: 'active', header: 'Active', render: row => (row.is_active ? 'Yes' : 'No') },
        { key: 'actions', header: 'Actions', render: row => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => onEdit(row)}>Edit</Button><Button size="sm" variant="outline" onClick={() => onToggle(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</Button></div> },
      ]}
    />
  )
}

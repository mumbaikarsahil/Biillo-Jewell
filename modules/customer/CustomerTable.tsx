'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Customer } from '@/modules/customer/customer.types'

interface Props {
  rows: Customer[]
  onEdit: (row: Customer) => void
  onDeactivate: (row: Customer) => void
}

export function CustomerTable({ rows, onEdit, onDeactivate }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyLabel="No customers found"
      columns={[
        { key: 'name', header: 'Name', render: row => row.full_name },
        { key: 'phone', header: 'Phone', render: row => row.phone },
        { key: 'email', header: 'Email', render: row => row.email || '-' },
        { key: 'city', header: 'City', render: row => row.city || '-' },
        { key: 'created', header: 'Created', render: row => new Date(row.created_at).toLocaleDateString() },
        { key: 'actions', header: 'Actions', render: row => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => onEdit(row)}>Edit</Button><Button size="sm" variant="outline" onClick={() => onDeactivate(row)}>Mark Inactive</Button></div> },
      ]}
    />
  )
}

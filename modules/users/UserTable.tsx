'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { ManagedUser } from '@/modules/users/users.types'

interface Props {
  rows: ManagedUser[]
  onRemove: (userId: string) => void
}

export function UserTable({ rows, onRemove }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyLabel="No users found"
      columns={[
        { key: 'email', header: 'Email', render: row => row.email || row.user_id },
        { key: 'role', header: 'Role', render: row => row.role },
        { key: 'warehouses', header: 'Warehouse Count', render: row => row.warehouses.length },
        { key: 'actions', header: 'Actions', render: row => <Button size="sm" variant="outline" onClick={() => onRemove(row.user_id)}>Remove</Button> },
      ]}
    />
  )
}

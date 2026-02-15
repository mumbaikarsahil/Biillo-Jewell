'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Company } from '@/modules/company/company.types'

interface Props {
  rows: Company[]
  onEdit: (row: Company) => void
  onDeactivate: (row: Company) => void
}

export function CompanyTable({ rows, onEdit, onDeactivate }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyLabel="No company record found"
      columns={[
        { key: 'legal_name', header: 'Legal Name', render: row => row.legal_name },
        { key: 'company_code', header: 'Code', render: row => row.company_code },
        { key: 'gstin', header: 'GSTIN', render: row => row.gstin || '-' },
        { key: 'status', header: 'Status', render: row => row.status },
        {
          key: 'actions',
          header: 'Actions',
          render: row => (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(row)}>Edit</Button>
              <Button size="sm" variant="outline" onClick={() => onDeactivate(row)}>Deactivate</Button>
            </div>
          ),
        },
      ]}
    />
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormModal } from '@/components/shared/FormModal'
import { createCompany, deactivateCompany, getCompanies, updateCompany } from '@/modules/company/company.api'
import { Company, CompanyInput } from '@/modules/company/company.types'
import { CompanyForm } from '@/modules/company/CompanyForm'
import { CompanyTable } from '@/modules/company/CompanyTable'

interface Props { companyId: string }

export function CompanyList({ companyId }: Props) {
  const [rows, setRows] = useState<Company[]>([])
  const [search, setSearch] = useState('')
  const [editItem, setEditItem] = useState<Company | null>(null)
  const [open, setOpen] = useState(false)

  const load = async () => {
    try {
      setRows(await getCompanies(companyId))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Load failed')
    }
  }

  useEffect(() => { load() }, [companyId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(row => [row.legal_name, row.company_code, row.gstin].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  const handleCreate = () => { setEditItem(null); setOpen(true) }
  const handleEdit = (row: Company) => { setEditItem(row); setOpen(true) }

  const handleSave = async (input: CompanyInput) => {
    if (editItem) await updateCompany(companyId, input)
    else await createCompany(companyId, input)
    toast.success('Company saved')
    setOpen(false)
    await load()
  }

  const handleDeactivate = async () => {
    await deactivateCompany(companyId)
    toast.success('Company deactivated')
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <Input placeholder="Search companies" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={handleCreate}>Edit Company</Button>
      </div>
      <CompanyTable rows={filtered} onEdit={handleEdit} onDeactivate={handleDeactivate} />

      <FormModal open={open} onOpenChange={setOpen} title="Company Form">
        <CompanyForm initialValue={editItem || undefined} onSubmit={handleSave} onCancel={() => setOpen(false)} />
      </FormModal>
    </div>
  )
}

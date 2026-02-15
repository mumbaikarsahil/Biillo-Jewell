'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormModal } from '@/components/shared/FormModal'
import { createCustomer, deactivateCustomer, getCustomers, updateCustomer } from '@/modules/customer/customer.api'
import { Customer, CustomerInput } from '@/modules/customer/customer.types'
import { CustomerForm } from '@/modules/customer/CustomerForm'
import { CustomerTable } from '@/modules/customer/CustomerTable'

interface Props { companyId: string }

export function CustomerList({ companyId }: Props) {
  const [rows, setRows] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Customer | null>(null)

  const load = async () => {
    try { setRows(await getCustomers(companyId)) }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Load failed') }
  }

  useEffect(() => { load() }, [companyId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(row => [row.full_name, row.phone, row.city, row.email].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  const save = async (input: CustomerInput) => {
    if (editItem) await updateCustomer(editItem.id, input)
    else await createCustomer(companyId, input)
    toast.success('Customer saved')
    setOpen(false)
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <Input placeholder="Search customers" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={() => { setEditItem(null); setOpen(true) }}>Add Customer</Button>
      </div>
      <CustomerTable rows={filtered} onEdit={row => { setEditItem(row); setOpen(true) }} onDeactivate={async row => { await deactivateCustomer(row); toast.success('Customer marked inactive in notes'); await load() }} />
      <FormModal open={open} onOpenChange={setOpen} title={editItem ? 'Edit Customer' : 'Add Customer'}>
        <CustomerForm initialValue={editItem || undefined} onSubmit={save} onCancel={() => setOpen(false)} />
      </FormModal>
    </div>
  )
}

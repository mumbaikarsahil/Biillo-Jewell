'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormModal } from '@/components/shared/FormModal'
import { createWarehouse, deactivateWarehouse, getWarehouses, updateWarehouse } from '@/modules/warehouse/warehouse.api'
import { Warehouse, WarehouseInput } from '@/modules/warehouse/warehouse.types'
import { WarehouseTable } from '@/modules/warehouse/WarehouseTable'
import { WarehouseForm } from '@/modules/warehouse/WarehouseForm'

interface Props { companyId: string }

export function WarehouseList({ companyId }: Props) {
  const [rows, setRows] = useState<Warehouse[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Warehouse | null>(null)

  const load = async () => {
    try { setRows(await getWarehouses(companyId)) }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Load failed') }
  }

  useEffect(() => { load() }, [companyId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(row => [row.name, row.warehouse_code, row.warehouse_type].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  const save = async (input: WarehouseInput) => {
    if (editItem) await updateWarehouse(editItem.id, input)
    else await createWarehouse(companyId, input)
    toast.success('Warehouse saved')
    setOpen(false)
    await load()
  }

  const onEdit = (row: Warehouse) => { setEditItem(row); setOpen(true) }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <Input placeholder="Search warehouses" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={() => { setEditItem(null); setOpen(true) }}>Add Warehouse</Button>
      </div>
      <WarehouseTable rows={filtered} onEdit={onEdit} onToggle={async row => { await deactivateWarehouse(row.id, row.is_active); toast.success('Warehouse status updated'); await load() }} />
      <FormModal open={open} onOpenChange={setOpen} title={editItem ? 'Edit Warehouse' : 'Add Warehouse'}>
        <WarehouseForm initialValue={editItem || undefined} onSubmit={save} onCancel={() => setOpen(false)} />
      </FormModal>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Warehouse, WarehouseInput } from '@/modules/warehouse/warehouse.types'

const schema = z.object({
  warehouse_code: z.string().min(2),
  name: z.string().min(2),
  warehouse_type: z.enum(['main_safe', 'factory', 'branch', 'transit']),
})

interface Props {
  initialValue?: Warehouse
  onSubmit: (input: WarehouseInput) => Promise<void>
  onCancel: () => void
}

export function WarehouseForm({ initialValue, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<WarehouseInput>({
    warehouse_code: initialValue?.warehouse_code || '',
    name: initialValue?.name || '',
    warehouse_type: initialValue?.warehouse_type || 'branch',
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message || 'Validation failed')

    setSaving(true)
    setError(null)
    try {
      await onSubmit(parsed.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input placeholder="Warehouse code" value={form.warehouse_code} onChange={e => setForm({ ...form, warehouse_code: e.target.value })} />
        <Input placeholder="Warehouse name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select className="border rounded-md px-3 py-2" value={form.warehouse_type} onChange={e => setForm({ ...form, warehouse_type: e.target.value as WarehouseInput['warehouse_type'] })}>
          <option value="main_safe">main_safe</option>
          <option value="factory">factory</option>
          <option value="branch">branch</option>
          <option value="transit">transit</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

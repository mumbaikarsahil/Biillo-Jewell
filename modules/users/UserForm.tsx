'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InviteUserInput } from '@/modules/users/users.types'

const schema = z.object({
  email: z.string().email(),
  role: z.string().min(3),
  warehouse_ids: z.array(z.string()),
})

interface Props {
  companyId: string
  warehouseOptions: { id: string; name: string }[]
  onSubmit: (payload: InviteUserInput) => Promise<void>
}

export function UserForm({ companyId, warehouseOptions, onSubmit }: Props) {
  const [form, setForm] = useState({ email: '', role: 'sales', warehouse_ids: [] as string[] })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) return setError(parsed.error.issues[0]?.message || 'Validation failed')

    setSaving(true)
    setError(null)
    try {
      await onSubmit({ ...parsed.data, company_id: companyId })
      setForm({ email: '', role: 'sales', warehouse_ids: [] })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invite failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 items-start">
      <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <select className="border rounded-md px-3 py-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="owner">owner</option>
        <option value="manager">manager</option>
        <option value="sales">sales</option>
        <option value="karigar">karigar</option>
      </select>
      <select multiple className="border rounded-md px-3 py-2 h-24" value={form.warehouse_ids} onChange={e => setForm({ ...form, warehouse_ids: Array.from(e.target.selectedOptions).map(option => option.value) })}>
        {warehouseOptions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <Button type="submit" disabled={saving}>{saving ? 'Inviting...' : 'Invite User'}</Button>
      {error ? <p className="md:col-span-4 text-sm text-red-600">{error}</p> : null}
    </form>
  )
}

'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Customer, CustomerInput } from '@/modules/customer/customer.types'

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
  birth_date: z.string().optional(),
  anniversary_date: z.string().optional(),
  notes: z.string().optional(),
})

interface Props {
  initialValue?: Customer
  onSubmit: (input: CustomerInput) => Promise<void>
  onCancel: () => void
}

export function CustomerForm({ initialValue, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<CustomerInput>({
    full_name: initialValue?.full_name || '',
    phone: initialValue?.phone || '',
    email: initialValue?.email || '',
    city: initialValue?.city || '',
    birth_date: initialValue?.birth_date || '',
    anniversary_date: initialValue?.anniversary_date || '',
    notes: initialValue?.notes || '',
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
      await onSubmit({ ...parsed.data, email: parsed.data.email || undefined })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input placeholder="Full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <Input type="date" value={form.birth_date} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
        <Input type="date" value={form.anniversary_date} onChange={e => setForm({ ...form, anniversary_date: e.target.value })} />
        <Input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

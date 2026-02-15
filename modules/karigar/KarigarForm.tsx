'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Karigar, KarigarInput } from '@/modules/karigar/karigar.types'

const schema = z.object({
  karigar_code: z.string().min(2),
  full_name: z.string().min(2),
  labor_type: z.enum(['PER_GRAM', 'FIXED']),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  default_labor_rate: z.number().nonnegative().optional(),
})

interface Props {
  initialValue?: Karigar
  onSubmit: (input: KarigarInput) => Promise<void>
  onCancel: () => void
}

export function KarigarForm({ initialValue, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    karigar_code: initialValue?.karigar_code || '',
    full_name: initialValue?.full_name || '',
    phone: initialValue?.phone || '',
    specialization: initialValue?.specialization || '',
    labor_type: initialValue?.labor_type || 'PER_GRAM',
    default_labor_rate: String(initialValue?.default_labor_rate || ''),
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = schema.safeParse({
      ...form,
      default_labor_rate: form.default_labor_rate ? Number(form.default_labor_rate) : undefined,
    })
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
        <Input placeholder="Karigar code" value={form.karigar_code} onChange={e => setForm({ ...form, karigar_code: e.target.value })} />
        <Input placeholder="Full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="Specialization" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
        <select className="border rounded-md px-3 py-2" value={form.labor_type} onChange={e => setForm({ ...form, labor_type: e.target.value as KarigarInput['labor_type'] })}>
          <option value="PER_GRAM">PER_GRAM</option>
          <option value="FIXED">FIXED</option>
        </select>
        <Input placeholder="Default labor rate" value={form.default_labor_rate} onChange={e => setForm({ ...form, default_labor_rate: e.target.value })} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Company, CompanyInput } from '@/modules/company/company.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const companySchema = z.object({
  legal_name: z.string().min(2),
  company_code: z.string().min(2),
  status: z.enum(['active', 'inactive', 'archived']),
  trade_name: z.string().optional(),
  pan_number: z.string().optional(),
  gstin: z.string().optional(),
  cin_number: z.string().optional(),
  logo_url: z.string().optional(),
})

interface Props {
  initialValue?: Company
  onSubmit: (input: CompanyInput) => Promise<void>
  onCancel: () => void
}

export function CompanyForm({ initialValue, onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CompanyInput>({
    legal_name: initialValue?.legal_name || '',
    trade_name: initialValue?.trade_name || '',
    company_code: initialValue?.company_code || '',
    pan_number: initialValue?.pan_number || '',
    gstin: initialValue?.gstin || '',
    cin_number: initialValue?.cin_number || '',
    logo_url: initialValue?.logo_url || '',
    status: initialValue?.status || 'active',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = companySchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onSubmit(parsed.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input placeholder="Legal name" value={form.legal_name} onChange={e => setForm({ ...form, legal_name: e.target.value })} />
        <Input placeholder="Company code" value={form.company_code} onChange={e => setForm({ ...form, company_code: e.target.value })} />
        <Input placeholder="Trade name" value={form.trade_name} onChange={e => setForm({ ...form, trade_name: e.target.value })} />
        <Input placeholder="PAN" value={form.pan_number} onChange={e => setForm({ ...form, pan_number: e.target.value })} />
        <Input placeholder="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
        <Input placeholder="CIN" value={form.cin_number} onChange={e => setForm({ ...form, cin_number: e.target.value })} />
        <Input placeholder="Logo URL" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} />
        <select className="border rounded-md px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as CompanyInput['status'] })}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="archived">archived</option>
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

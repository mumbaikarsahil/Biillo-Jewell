'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormModal } from '@/components/shared/FormModal'
import { createKarigar, deactivateKarigar, getKarigars, updateKarigar } from '@/modules/karigar/karigar.api'
import { Karigar, KarigarInput } from '@/modules/karigar/karigar.types'
import { KarigarForm } from '@/modules/karigar/KarigarForm'
import { KarigarTable } from '@/modules/karigar/KarigarTable'

interface Props { companyId: string }

export function KarigarList({ companyId }: Props) {
  const [rows, setRows] = useState<Karigar[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Karigar | null>(null)

  const load = async () => {
    try { setRows(await getKarigars(companyId)) }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Load failed') }
  }

  useEffect(() => { load() }, [companyId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(row => [row.full_name, row.karigar_code, row.specialization].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  const save = async (input: KarigarInput) => {
    if (editItem) await updateKarigar(editItem.id, input)
    else await createKarigar(companyId, input)
    toast.success('Karigar saved')
    setOpen(false)
    await load()
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <Input placeholder="Search karigars" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={() => { setEditItem(null); setOpen(true) }}>Add Karigar</Button>
      </div>
      <KarigarTable rows={filtered} onEdit={row => { setEditItem(row); setOpen(true) }} onToggle={async row => { await deactivateKarigar(row.id, row.is_active); toast.success('Karigar status updated'); await load() }} />
      <FormModal open={open} onOpenChange={setOpen} title={editItem ? 'Edit Karigar' : 'Add Karigar'}>
        <KarigarForm initialValue={editItem || undefined} onSubmit={save} onCancel={() => setOpen(false)} />
      </FormModal>
    </div>
  )
}

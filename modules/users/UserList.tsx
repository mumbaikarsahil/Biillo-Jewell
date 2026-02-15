'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { getUsers, inviteUser, removeUser } from '@/modules/users/users.api'
import { ManagedUser } from '@/modules/users/users.types'
import { UserForm } from '@/modules/users/UserForm'
import { UserTable } from '@/modules/users/UserTable'

interface Props {
  companyId: string
  warehouses: { id: string; name: string }[]
}

export function UserList({ companyId, warehouses }: Props) {
  const [rows, setRows] = useState<ManagedUser[]>([])
  const [search, setSearch] = useState('')

  const load = async () => {
    try { setRows(await getUsers(companyId)) }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Load failed') }
  }

  useEffect(() => { load() }, [companyId])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows.filter(row => [row.email, row.role].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  return (
    <div className="space-y-3">
      <Input placeholder="Search users" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
      <UserForm companyId={companyId} warehouseOptions={warehouses} onSubmit={async payload => { await inviteUser(payload); toast.success('User invited'); await load() }} />
      <UserTable rows={filtered} onRemove={async userId => { await removeUser(userId); toast.success('User mapping removed'); await load() }} />
    </div>
  )
}

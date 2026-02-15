'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { UserList } from '@/modules/users/UserList'
import { getWarehouses } from '@/modules/warehouse/warehouse.api'
import { useRBAC } from '@/hooks/useRBAC'

interface WarehouseOption {
  id: string
  name: string
}

export default function MasterUsersPage() {
  const { companyId, canAccessMasterModule } = useRBAC()
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([])

  useEffect(() => {
    if (!companyId) return
getWarehouses(companyId).then(data => setWarehouses(data.map(item => ({ id: item.id, name: item.name }))))
  }, [companyId])

  if (!canAccessMasterModule('users')) {
    return <AppLayout><Card className="p-6">Only owner can access User Role Mapping.</Card></AppLayout>
  }

  if (!companyId) {
    return <AppLayout><Card className="p-6">No company context found.</Card></AppLayout>
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">User Role Mapping</h1>
        <UserList companyId={companyId} warehouses={warehouses} />
      </div>
    </AppLayout>
  )
}

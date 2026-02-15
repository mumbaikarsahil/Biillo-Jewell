'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { WarehouseList } from '@/modules/warehouse/WarehouseList'
import { useRBAC } from '@/hooks/useRBAC'

export default function MasterWarehousePage() {
  const { companyId, canAccessMasterModule } = useRBAC()

  if (!canAccessMasterModule('warehouse')) {
    return <AppLayout><Card className="p-6">You are not allowed to access Warehouse Management.</Card></AppLayout>
  }

  if (!companyId) {
    return <AppLayout><Card className="p-6">No company context found.</Card></AppLayout>
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Warehouse Management</h1>
        <WarehouseList companyId={companyId} />
      </div>
    </AppLayout>
  )
}

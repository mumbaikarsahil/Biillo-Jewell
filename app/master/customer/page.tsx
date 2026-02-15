'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { CustomerList } from '@/modules/customer/CustomerList'
import { useRBAC } from '@/hooks/useRBAC'

export default function MasterCustomerPage() {
  const { companyId, canAccessMasterModule } = useRBAC()

  if (!canAccessMasterModule('customer')) {
    return <AppLayout><Card className="p-6">You are not allowed to access Customer Master.</Card></AppLayout>
  }

  if (!companyId) {
    return <AppLayout><Card className="p-6">No company context found.</Card></AppLayout>
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Customer Master</h1>
        <CustomerList companyId={companyId} />
      </div>
    </AppLayout>
  )
}

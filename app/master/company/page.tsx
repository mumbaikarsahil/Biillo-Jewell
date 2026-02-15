'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { CompanyList } from '@/modules/company/CompanyList'
import { useRBAC } from '@/hooks/useRBAC'

export default function MasterCompanyPage() {
  const { companyId, canAccessMasterModule } = useRBAC()

  if (!canAccessMasterModule('company')) {
    return <AppLayout><Card className="p-6">You are not allowed to access Company Setup.</Card></AppLayout>
  }

  if (!companyId) {
    return <AppLayout><Card className="p-6">No company context found.</Card></AppLayout>
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Company Setup</h1>
        <CompanyList companyId={companyId} />
      </div>
    </AppLayout>
  )
}

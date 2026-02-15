'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { KarigarList } from '@/modules/karigar/KarigarList'
import { useRBAC } from '@/hooks/useRBAC'

export default function MasterKarigarPage() {
  const { companyId, canAccessMasterModule } = useRBAC()

  if (!canAccessMasterModule('karigar')) {
    return <AppLayout><Card className="p-6">You are not allowed to access Karigar Master.</Card></AppLayout>
  }

  if (!companyId) {
    return <AppLayout><Card className="p-6">No company context found.</Card></AppLayout>
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Karigar Master</h1>
        <KarigarList companyId={companyId} />
      </div>
    </AppLayout>
  )
}

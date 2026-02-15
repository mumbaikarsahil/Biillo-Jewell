import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { canAccessMasterModule, getAllowedMasterModules, MasterModule } from '@/lib/rbac'

export function useRBAC() {
  const { appUser } = useAuth()

  const role = appUser?.role || null

  return useMemo(() => ({
    role,
    companyId: appUser?.company_id || null,
    canAccessMasterModule: (module: MasterModule) => canAccessMasterModule(role, module),
    allowedMasterModules: getAllowedMasterModules(role),
  }), [appUser?.company_id, role])
}

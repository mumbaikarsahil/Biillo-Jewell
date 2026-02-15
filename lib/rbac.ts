import { isManagerRole, isOwnerRole, isSalesRole, normalizeRole } from '@/lib/auth'

export type MasterModule = 'company' | 'warehouse' | 'users' | 'karigar' | 'customer'

export function canAccessMasterModule(role: string | null | undefined, module: MasterModule) {
  if (module === 'customer') {
    return isOwnerRole(role) || isManagerRole(role) || isSalesRole(role)
  }

  if (module === 'users') {
    return isOwnerRole(role)
  }

  return isOwnerRole(role) || isManagerRole(role)
}

export function getAllowedMasterModules(role: string | null | undefined): MasterModule[] {
  const normalized = normalizeRole(role)
  if (!normalized) return []

  const modules: MasterModule[] = []
  ;(['company', 'warehouse', 'users', 'karigar', 'customer'] as MasterModule[]).forEach(module => {
    if (canAccessMasterModule(role, module)) modules.push(module)
  })
  return modules
}

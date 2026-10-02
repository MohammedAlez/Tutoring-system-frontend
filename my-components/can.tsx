// components/can.tsx
'use client'

import { useCurrentUser } from './user-provider'
import type { Role } from '@/lib/rbac'

// Gate by role: <Can roles={["ADMIN", "TEACHER"]}>...</Can>
export function Can({
  roles,
  children,
  fallback = null,
}: {
  roles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const user = useCurrentUser()
  if (!user || !roles.includes(user.role)) return <>{fallback}</>
  return <>{children}</>
}
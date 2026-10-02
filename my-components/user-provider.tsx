// components/user-provider.tsx
'use client'

import { createContext, useContext } from 'react'
import type { CurrentUser } from '@/lib/user'

const UserContext = createContext<CurrentUser | null>(null)

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser | null
  children: React.ReactNode
}) {
    console.log("UserProvider user:", user)
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

// Server Component checks (requireUser/requireRole) remain the real guard.
// This hook is for UX only — hiding/showing buttons, links, sections.
export function useCurrentUser() {
  return useContext(UserContext)
}
// app/lib/user.ts
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { fetchWithAuth } from './api'
import type { Role } from './rbac'

export interface CurrentUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  status: string
  role: Role
  school?: {
    id?: string
    name?: string
    [key: string]: unknown
  } | null
  // add whatever else your /auth/me payload includes
}

// React's cache() dedupes this within a single render pass — call it from as
// many Server Components/layouts as you want, it only hits the API once per request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    const res = await fetchWithAuth('/auth/me', {
      method: 'GET',
      cache: 'no-store',
    })

    if (!res.ok) return null

    const payload = await res.json()
    console.log('getCurrentUser payload:', payload)
    return payload.data as CurrentUser
  } catch {
    console.log('Error fetching current user')
    return null
  }
})

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

// export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
//   const user = await requireUser()
//   if (!roles.includes(user.role)) {
//     redirect('/unauthorized')
//   }
//   return user
// }
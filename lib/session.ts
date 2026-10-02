// app/lib/session.ts
// Pure cookie management. Deliberately has NO import from ./api, so the
// dependency graph stays one-directional: api.ts -> session.ts (never back).
// getCurrentUserFromApi() moved to ./user.ts, which is the one allowed to
// depend on both.
'use server'
import { cookies } from 'next/headers'

export async function createSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()

  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  })

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
}
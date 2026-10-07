// app/lib/api.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSession, destroySession } from './session'

const API_BASE_URL = process.env.API_URL || 'http://localhost:8500/api'

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('accessToken')?.value

  const headers = new Headers(options.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    const refreshSuccess = await refreshTokens()

    if (refreshSuccess) {
      const updatedCookieStore = await cookies()
      const newAccessToken = updatedCookieStore.get('accessToken')?.value

      if (newAccessToken) {
        headers.set('Authorization', `Bearer ${newAccessToken}`)
      }

      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })
    } else {
      await destroySession()
      redirect('/login')
    }
  }

  return response
}

// --- Single-flight lock for refreshTokens() ---------------------------------
// Problem this solves: if two Server Components on the same page both call
// fetchWithAuth() while the access token is expired, both would previously
// hit /auth/refresh independently. Since refresh tokens are rotated, the
// second call sends an already-invalidated token and fails, logging the user
// out even though their session was valid a moment earlier.
//
// This module-scoped promise dedupes concurrent refresh calls that happen
// within the same request/render. It does NOT protect against two entirely
// separate concurrent HTTP requests hitting the server at the same instant —
// for that, ask your API team whether /auth/refresh tolerates a short reuse
// grace period on the just-rotated refresh token.
let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = doRefresh()
  const result = await refreshPromise
  refreshPromise = null
  return result
}

async function doRefresh(): Promise<boolean> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) return false

    const result = await res.json()
    const { accessToken, refreshToken: newRefreshToken } = result.data

    // NOTE: this is a safety net, not the primary fix. The primary fix is
    // proactive refresh in middleware.ts, which runs before any Server
    // Component renders and is legally allowed to write cookies. If we
    // still land here from inside a plain Server Component (page/layout
    // render, not a Server Action or Route Handler), cookies().set() will
    // throw. Swallow that specific failure instead of crashing the render —
    // worst case the user is treated as logged out and middleware will
    // refresh properly on the next navigation.
    try {
      await createSession(accessToken, newRefreshToken)
    } catch (cookieError) {
      console.warn(
        'Token refresh succeeded but could not persist cookies (likely called during a Server Component render, not a Server Action/Route Handler). Relying on middleware to refresh proactively next time.',
        cookieError
      )
      return false
    }

    return true
  } catch (error) {
    return false
  }
}
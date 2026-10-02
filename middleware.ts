import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/definitions'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api'
const REFRESH_BUFFER_MS = 30_000 // refresh 30s before actual expiry, not exactly at expiry

// Decodes the JWT payload WITHOUT verifying the signature — we only need
// `exp` to decide "should we bother refreshing", not to trust the token's
// claims. The external API is still the one that verifies the signature on
// every request; this is purely an optimization to avoid refreshing on
// every single request.
function decodeJwtExpMs(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json)
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const hasSession = Boolean(refreshToken)

  const isProtectedRoute = PROTECTED_ROUTES.some((route: string) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = AUTH_ROUTES.some((route: string) =>
    pathname.startsWith(route)
  )

  // 1. No session at all on a protected route -> /login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Already logged in and hitting /login or /register -> /dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Proactive refresh — THIS is what fixes the "Cookies can only be
  //    modified in a Server Action or Route Handler" crash.
  //
  //    Middleware runs before any Server Component renders, and it's one of
  //    the only places (along with Server Actions and Route Handlers)
  //    allowed to write cookies. By refreshing here, the accessToken cookie
  //    is already valid by the time getCurrentUser()/fetchWithAuth() run
  //    inside RootLayout or any page — they should now just read a good
  //    token and never need to write one themselves during a render.
  let response = NextResponse.next({ request })

  if (isProtectedRoute && refreshToken) {
    const exp = accessToken ? decodeJwtExpMs(accessToken) : null
    const needsRefresh = !accessToken || !exp || exp < Date.now() + REFRESH_BUFFER_MS

    if (needsRefresh) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })

        if (res.ok) {
          const result = await res.json()
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data

          // Update cookies on the REQUEST object so the current render
          // (this same request, e.g. the RootLayout about to run) sees the
          // fresh token via cookies().get('accessToken') — not just future
          // requests. This is the same pattern Supabase's official
          // updateSession() middleware helper uses.
          request.cookies.set('accessToken', newAccessToken)
          request.cookies.set('refreshToken', newRefreshToken)
          response = NextResponse.next({ request })

          // Persist to the browser too, so the NEXT navigation also starts
          // with a fresh token.
          const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          }
          response.cookies.set('accessToken', newAccessToken, {
            ...cookieOpts,
            maxAge: 15 * 60,
          })
          response.cookies.set('refreshToken', newRefreshToken, {
            ...cookieOpts,
            maxAge: 7 * 24 * 60 * 60,
          })
        } else {
          // Refresh token itself is dead/revoked — no point letting the
          // request through, force a real login.
          const loginUrl = new URL('/login', request.url)
          loginUrl.searchParams.set('from', pathname)
          const redirectResponse = NextResponse.redirect(loginUrl)
          redirectResponse.cookies.delete('accessToken')
          redirectResponse.cookies.delete('refreshToken')
          return redirectResponse
        }
      } catch {
        // Network error reaching the API from middleware — let the request
        // through as-is. Downstream fetchWithAuth will hit a 401 and, with
        // the try/catch added in api.ts, fail gracefully (treated as
        // logged-out) instead of crashing the render.
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
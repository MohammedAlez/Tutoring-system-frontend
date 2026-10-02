// app/api/proxy/[...path]/route.ts
//
// Every client-side fetch should hit /api/proxy/<your-api-path> instead of
// calling NEXT_PUBLIC_API_URL directly. This keeps the request same-origin
// (cookie sent automatically) and reuses fetchWithAuth's refresh logic, so
// the browser never needs to know or handle the access token.
//
// Example: a client component calling fetch('/api/proxy/classes/123/students')
// forwards to `${API_BASE_URL}/classes/123/students` with the Bearer token attached.

import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/api'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const endpoint = '/' + path.join('/') + req.nextUrl.search

  const hasBody = !['GET', 'HEAD'].includes(req.method)

  try {
    const res = await fetchWithAuth(endpoint, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
      },
      body: hasBody ? await req.text() : undefined,
    })

    // Pass through empty bodies (e.g. 204 No Content) without choking on .json()
    const text = await res.text()
    const data = text ? JSON.parse(text) : null

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    // fetchWithAuth throws/redirects on unrecoverable auth failure; anything
    // else is an unexpected error.
    return NextResponse.json({ message: 'Proxy request failed' }, { status: 500 })
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
}
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { CurrentUser } from '@/lib/user'
import { UserProvider } from '@/my-components/user-provider'

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode
  user: CurrentUser | null
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30s — tune per how "live" your data needs to be
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider user={user}>{children}</UserProvider>
    </QueryClientProvider>
  )
}
// hooks/use-api.ts
// Thin wrapper so every resource hook doesn't repeat the same fetch/JSON boilerplate.
// All requests go through /api/proxy/* (see app/api/proxy/[...path]/route.ts),
// never directly to NEXT_PUBLIC_API_URL from the browser.
import { useQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'

async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  console.log("start fetching")
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  console.log("response: ", res)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  
  return res.json()
}

export function useApiQuery<T>(queryKey: QueryKey, path: string) {
  return useQuery({
    queryKey,
    queryFn: () => proxyFetch<T>(path),
  })
}

export function useApiMutation<TResponse, TBody = unknown>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  invalidateKey?: QueryKey
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: TBody) =>
      proxyFetch<TResponse>(path, { method, body: body ? JSON.stringify(body) : undefined }),
    onSuccess: () => {
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
  })
}

// Example usage:
// const { data: students, isLoading } = useApiQuery<Student[]>(['students', classId], `/classes/${classId}/students`)
// const markAttendance = useApiMutation<void, { studentId: string; present: boolean }>(
//   `/classes/${classId}/attendance`, 'POST', ['attendance', classId]
// )
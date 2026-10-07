// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginFormSchema, FormState } from '@/lib/definitions'
import { createSession, destroySession } from '@/lib/session'

const API_BASE_URL = process.env.API_URL || 'http://localhost:8500/api'

export async function loginAction(state: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        message: result.message || 'Invalid credentials. Please try again.',
      }
    }

    const { accessToken, refreshToken } = result.data
    await createSession(accessToken, refreshToken)
  } catch (error) {
    return {
      message: 'Server connection error. Please try again later.',
    }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (refreshToken && accessToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  await destroySession()
  redirect('/login')
}
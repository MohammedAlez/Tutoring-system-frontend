import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }),
})

export type FormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
  accessToken: string
  refreshToken: string
  expiresAt: number
}


export const PROTECTED_ROUTES = ['/dashboard', '/settings', '/profile']
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password']
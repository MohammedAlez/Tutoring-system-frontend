// import 'server-only'

// import { cache } from 'react'
// import { redirect } from 'next/navigation'
// import { getCurrentUserFromApi } from '@/lib/session'
// import { fetchWithAuth } from '@/lib/api'

// /**
//  * Verifies the session and returns the current user profile.
//  * Cached per request cycle using React cache().
//  */
// export const verifySession = cache(async () => {
//   const user = await getCurrentUserFromApi()

//   if (!user) {
//     redirect('/login')
//   }

//   return { isAuth: true, user }
// })

// /**
//  * Example DAL function: Fetch user profile data safely.
//  */
// export const getUser = cache(async () => {
//   const { user } = await verifySession()

//   // Additional data fetching if needed, or simply return the session user
//   return user
// })

// /**
//  * Example DAL function: Fetch school details from Express API.
//  */
// // export const getSchoolDetails = cache(async () => {
// //   await verifySession()

// //   const response = await fetchWithAuth('/school/details')
  
// //   if (!response.ok) {
// //     return null
// //   }

// //   const result = await response.json()
// //   return result.data
// // })
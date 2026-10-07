// // app/lib/axios-client.ts
// import axios from 'axios'

// export const api = axios.create({
//   baseURL: process.env.API_URL || 'http://localhost:8500/api',
//   withCredentials: true,
// })

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     // Check if error is 401 and request hasn't been retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         // Call backend refresh endpoint
//         await axios.post(
//           `${process.env.API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         )

//         // Retry original request with updated cookie session
//         return api(originalRequest)
//       } catch (refreshError) {
//         // Refresh token expired or invalid -> Redirect to login
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login'
//         }
//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )
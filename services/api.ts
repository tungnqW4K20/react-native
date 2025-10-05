import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// const BASE_URL = 'https://benodejs-9.onrender.com/api'

const BASE_URL = API_URL
console.log("BASE_URL", BASE_URL)
let isRefreshing = false
let subscribers: ((token: string) => void)[] = []

// Notify tất cả request đang chờ khi có token mới
function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}

const api = axios.create({
  baseURL: 'https://benodejs-9.onrender.com/api',
  // baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Gắn access token vào request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Xử lý refresh token khi gặp 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Nếu đang refresh thì đưa request vào queue để chờ token mới
        return new Promise((resolve) => {
          subscribers.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            console.log("🔁 Retrying queued request:", originalRequest.url)
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token found')
        }

        console.log("🔄 Refreshing token...")

        // Gọi API refresh token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data

          await AsyncStorage.setItem('token', accessToken)
          await AsyncStorage.setItem('refreshToken', newRefreshToken)

          console.log("✅ Token refreshed, retrying original request:", originalRequest.url)

          // Báo cho tất cả request đang chờ
          onRefreshed(accessToken)

          // Retry request gốc
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return api(originalRequest)
        } else {
          throw new Error('Refresh token failed')
        }
      } catch (err) {
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  login: (data: { emailOrUsername: string; password: string }) =>
    api.post('/auth/login', data),
}

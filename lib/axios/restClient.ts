import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { getSession, signIn, signOut } from "next-auth/react"

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  Auth?: boolean
}

const restClient = axios.create({
  baseURL: '/api/rest',
  timeout: 10000,
})



restClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const customConfig = config as CustomAxiosRequestConfig
    const requireAuth = customConfig.Auth ?? false

    if (requireAuth) {
      const session = await getSession()
      const accessToken = session?.accessToken

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }
    return config
  },
)

// 응답 인터셉터
restClient.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error: any) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 401 에러이고, 재시도한 요청이 아닐 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 무한 재시도 방지를 위해 플래그 설정

      const session = await getSession()
      if (session?.refreshToken) {
        try {
          const response = await axios.post("/api/rest/refresh-token", {
            refreshToken: session.refreshToken,
          })

          const newAccessToken = response.data.accessToken
          await signIn("credentials", {
            redirect: false,
            accessToken: newAccessToken,
            refreshToken: session.refreshToken,
          })

          // 원래 요청의 헤더에 새로운 토큰 설정
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = newAccessToken
          }

          // 원래 요청 재시도
          return restClient(originalRequest)
        } catch (refreshError) {

          console.error("Session refresh failed:", refreshError)
          signOut()
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  },
)

export default restClient

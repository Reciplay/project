import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "../../stores/authStore"

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean
}

const restClient = axios.create({
  baseURL: '/api/rest',
  timeout: 10000,
})

restClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const customConfig = config as CustomAxiosRequestConfig;
    const requireAuth = customConfig.withAuth ?? false
    if (requireAuth) {
      const token = useAuthStore.getState().getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config
  }
)

export default restClient

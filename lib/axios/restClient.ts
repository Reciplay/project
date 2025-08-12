import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

declare module "axios" {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
    useCors?: boolean;
  }
}

const restClient = axios.create({
  baseURL: "/api/rest",
  timeout: 10000,
});

restClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    console.log(`[restClient REQUEST]`, {
      method: config.method,
      url: config.baseURL + config.url,
      requireAuth: config.requireAuth,
      useCors: config.useCors,
      headers: config.headers,
    });
    const requireAuth = config.requireAuth ?? false;

    if (requireAuth) {
      const session = await getSession();
      const accessToken = session?.accessToken;

      if (accessToken) {
        config.headers.Authorization = accessToken;
      }
    }

    if (config.useCors === false) {
      config.baseURL = "http://i13e104.p.ssafy.io:8080/api/v1/";
    } else {
      config.baseURL = "/api/rest";
    }
    return config;
  }
);

// restClient.interceptors.response.use(
//   (response) => response,
//   async (error: any) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       const session = await getSession()
//       if (session?.refreshToken) {
//         try {
//           const response = await axios.post("/api/rest/refresh-token", {
//             refreshToken: session.refreshToken,
//           })

//           const newAccessToken = response.data.accessToken
//           await signIn("credentials", {
//             redirect: false,
//             accessToken: newAccessToken,
//             refreshToken: session.refreshToken,
//           })

//           if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
//           }

//           return restClient(originalRequest)
//         } catch (refreshError) {

//           console.error("Session refresh failed:", refreshError)
//           signOut()
//           return Promise.reject(refreshError)
//         }
//       }
//     }

//     return Promise.reject(error)
//   },
// )

export default restClient;

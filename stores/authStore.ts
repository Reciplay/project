import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthStore } from './types/authStore'
import restClient from '../lib/axios/restClient'
import qs from 'qs'

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      isLoggedIn: false,
      isLoading: false,
      error: null,

      accessToken: null,
      refreshToken: null,
      accessTokenExpiry: null,

      nickname: null,
      userRole: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null })
        const res = await restClient.post("/login", qs.stringify({ username, password }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        const data = res.data
        const headers = res.headers
        set({ isLoading: false })

        set({ accessToken: headers.authorization })
        // set({ accessTokenExpiry: data.accessTokenExpiry })
        // set({ refreshToken: data.refreshToken })
        set({ isLoggedIn: true })
        // set({ nickname: data.nickname })
        // set({ userRole: data.userRole })
      },
      socialLogin: async (nickname: string, authToken: string) => {
        set({ isLoading: true, error: null })
        const res = await restClient.post("/api/rest/login/social", { nickname: nickname, authToken: authToken })
        const data = res.data
        set({ isLoading: false })
        set({ accessToken: data.accessToken })
        set({ accessTokenExpiry: data.accessTokenExpiry })
        set({ refreshToken: data.refreshToken })
        set({ isLoggedIn: true })
        set({ nickname: data.nickname })
        set({ userRole: data.userRole })
      },
      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
          accessTokenExpiry: null,
          nickname: null,
          userRole: null,
          error: null,
        });
      },
      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const res = await restClient.post('/api/rest/token/refresh', { refreshToken });
          const data = res.data;
          set({
            accessToken: data.accessToken,
            accessTokenExpiry: data.accessTokenExpiry,
          });
        } catch (error) {
          console.error('Failed to refresh session:', error);
          set({
            isLoggedIn: false,
            accessToken: null,
            refreshToken: null,
            accessTokenExpiry: null,
            nickname: null,
            userRole: null,
            error: 'Session refresh failed.',
          });
        }
      },
      getAccessToken: () => {
        return get().accessToken
      },
      getNickname: () => {
        return get().nickname
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
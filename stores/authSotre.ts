import { access } from 'fs'
import { create } from 'zustand'
import axios from 'axios'
import { AuthStore } from './types/authStore'


export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiry: null,
  username: null,
  userRole: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null })

    return ""
  },
  socialLogin: async (username: string, authToken: string) => {
    return ""
  },
  logout: () => { },
  refreshSession: async () => { },

}))
export interface AuthStore {
  isLoggedIn: boolean,
  isLoading: boolean,
  error: string | null,

  accessToken: string | null,
  refreshToken: string | null,
  accessTokenExpiry: number | null,

  username: string | null,
  userRole: string | null,

  login: (username: string, password: string) => Promise<string>,
  socialLogin: (username: string, authToken: string) => Promise<string>,
  logout: () => void,
  refreshSession: () => Promise<void>,
}

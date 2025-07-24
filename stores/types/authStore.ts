export interface AuthStore {
  isLoggedIn: boolean,
  isLoading: boolean,
  error: string | null,

  accessToken: string | null,
  refreshToken: string | null,
  accessTokenExpiry: number | null,

  nickname: string | null,
  userRole: string | null,

  login: (username: string, password: string) => Promise<void>,
  socialLogin: (username: string, authToken: string) => Promise<void>,
  logout: () => void,
  refreshSession: () => Promise<void>,
  getAccessToken: () => string | null,
  getNickname: () => string | null,
}

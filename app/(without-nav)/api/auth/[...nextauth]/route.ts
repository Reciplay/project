import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import CredentialsProvider from "next-auth/providers/credentials"
import FormData from "form-data"
import axios from "axios"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null
        }

        try {
          const formdata = new FormData()
          formdata.append('username', credentials.email)
          formdata.append('password', credentials.password)
          const res = await axios.post('http://i13e104.p.ssafy.io:8080/api/v1/login', formdata, {
            headers: {
              ...formdata.getHeaders()
            }
          })

          const accessToken = res.headers.authorization
          const refreshToken = res.headers['set-cookie'][0]
          const expires = res.headers.expires

          if (accessToken || refreshToken) {
            const user = {
              id: credentials.email,
              email: credentials.email,
              accessToken: accessToken,
              refreshToken: refreshToken,
              accessTokenExpires: expires,
            }
            return user
          } else {
            return null
          }
        } catch (error) {
          console.error("Error during authorization:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      if (token.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

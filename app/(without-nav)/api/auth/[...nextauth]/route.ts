import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import CredentialsProvider from "next-auth/providers/credentials"
import restClient from "@/lib/axios/restClient"

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
          const res = await restClient.post('/login', {
            email: credentials.email,
            password: credentials.password,
          })

          // Assuming a successful login returns a token in res.data.token
          // and the rest client will throw for non-2xx responses.
          const { token } = res.data

          if (token) {
            const user = {
              id: credentials.email,
              email: credentials.email,
              accessToken: token,
              refreshToken: "",
              accessTokenExpires: 0,
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
      // The 'user' object is only passed on the first call after a successful login.
      if (user) {
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (token.email) {
        session.user.email = token.email
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

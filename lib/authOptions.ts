// lib/authOptions.ts
import axios, { AxiosResponse } from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

interface LoginResponseBody {
  role: string;
  required: boolean;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const body = new URLSearchParams();
        body.append("username", credentials.email);
        body.append("password", credentials.password);

        const res: AxiosResponse<LoginResponseBody> = await axios.post(
          "http://i13e104.p.ssafy.io:8080/api/v1/user/auth/login",
          body,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        );

        // authorization: "Bearer xxx" or "xxx"
        const authHeader =
          typeof res.headers.authorization === "string"
            ? res.headers.authorization
            : undefined;
        const accessToken = authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7)
          : authHeader;

        // set-cookie may be string | string[]
        const setCookieHeader = res.headers["set-cookie"];
        const firstCookie = Array.isArray(setCookieHeader)
          ? setCookieHeader[0]
          : setCookieHeader;
        const refreshToken = firstCookie
          ? firstCookie.split(";")[0].split("=")[1]
          : undefined;

        const { role, required } = res.data;
        const expiresHeader =
          typeof res.headers.expires === "string"
            ? res.headers.expires
            : undefined;
        const accessTokenExpires = expiresHeader
          ? new Date(expiresHeader).getTime()
          : undefined;

        if (accessToken || refreshToken) {
          return {
            id: credentials.email,
            email: credentials.email,
            role,
            required,
            accessToken,
            refreshToken,
            accessTokenExpires,
          };
        }
        return null;
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
        token.role = (user as { role?: string }).role;
        token.required = (user as { required?: boolean }).required;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        token.accessTokenExpires = (
          user as { accessTokenExpires?: number }
        ).accessTokenExpires;
      }
      return token;
    },
    async session({ session, token }) {
      session.role = typeof token.role === "string" ? token.role : undefined;
      session.required =
        typeof token.required === "boolean" ? token.required : undefined;
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.refreshToken =
        typeof token.refreshToken === "string" ? token.refreshToken : undefined;
      // session.accessTokenExpires =
      //   typeof token.accessTokenExpires === "number"
      //     ? token.accessTokenExpires
      //     : undefined;
      return session;
    },
  },
  pages: { signIn: "/auth/login/" },
  secret: process.env.NEXTAUTH_SECRET,
};

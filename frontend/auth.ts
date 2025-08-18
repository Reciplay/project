// // auth.ts (프로젝트 루트 권장)
// import axios, { AxiosResponse, RawAxiosResponseHeaders } from "axios";
// import "next-auth";
// import type { Session } from "next-auth";
// import NextAuth from "next-auth";
// import "next-auth/jwt";
// import type { JWT } from "next-auth/jwt";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import Kakao from "next-auth/providers/kakao";
// import Naver from "next-auth/providers/naver";

// // 백엔드 로그인 응답 바디 타입
// interface LoginResponseBody {
//   role: string;
//   required: boolean;
// }

// // Credentials authorize에서 반환할 사용자 타입(NextAuth User 호환)
// interface AuthorizedUser {
//   id: string;
//   email: string;
//   accessToken?: string;
//   refreshToken?: string;
//   accessTokenExpires?: number; // epoch ms
//   role?: string;
//   required?: boolean;
// }

// // 유틸: 헤더에서 문자열을 안전하게 추출
// function getHeaderString(
//   headers: RawAxiosResponseHeaders | Record<string, string>,
//   key: string,
// ): string | undefined {
//   const value = (headers as Record<string, unknown>)[key];
//   if (typeof value === "string") return value;
//   if (Array.isArray(value)) return value[0];
//   return undefined;
// }

// // 유틸: "Bearer xxx" → "xxx"
// function stripBearer(token: string | undefined): string | undefined {
//   if (!token) return undefined;
//   return token.startsWith("Bearer ") ? token.slice(7) : token;
// }

// // 유틸: Set-Cookie에서 refreshToken 파싱(쿠키명은 백엔드 규격에 맞게)
// function extractRefreshToken(
//   setCookieHeader: string | undefined,
//   cookieName = "refreshToken",
// ): string | undefined {
//   if (!setCookieHeader) return undefined;
//   // 다수 쿠키가 한 헤더에 있을 수도 있어 split
//   const parts = setCookieHeader.split(/,(?=\s*\w+=)/); // 쿠키 경계 분리
//   for (const part of parts) {
//     const [kv] = part.trim().split(";");
//     const [k, v] = kv.split("=");
//     if (k === cookieName) return v;
//   }
//   // 쿠키명이 다르다면 "name=value" 첫 항을 fallback
//   const first = setCookieHeader.split(";")[0];
//   const maybe = first.split("=")[1];
//   return maybe;
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials): Promise<AuthorizedUser | null> {
//         if (!credentials?.email || !credentials.password) return null;

//         const form = new URLSearchParams();
//         form.append("username", credentials.email);
//         form.append("password", credentials.password);

//         // Node 런타임에서 실행되어야 함 (route.ts에서 runtime = "nodejs")
//         const res: AxiosResponse<LoginResponseBody> = await axios.post(
//           "http://i13e104.p.ssafy.io:8080/api/v1/user/auth/login",
//           form,
//           { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//         );

//         const rawAuth = getHeaderString(res.headers, "authorization"); // "Bearer xxx" 가능
//         const accessToken = stripBearer(rawAuth);

//         const setCookie = getHeaderString(res.headers, "set-cookie");
//         const refreshToken = extractRefreshToken(setCookie);

//         const role = res.data?.role;
//         const required = res.data?.required;

//         // 만료 시간(옵션): 헤더 "expires"가 날짜 문자열이라 가정
//         const expiresStr = getHeaderString(res.headers, "expires");
//         const accessTokenExpires = expiresStr
//           ? new Date(expiresStr).getTime()
//           : undefined;

//         if (accessToken || refreshToken) {
//           const user: AuthorizedUser = {
//             id: credentials.email,
//             email: credentials.email,
//             accessToken,
//             refreshToken,
//             accessTokenExpires,
//             role,
//             required,
//           };
//           return user;
//         }
//         return null;
//       },
//     }),
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     Kakao({
//       clientId: process.env.KAKAO_CLIENT_ID!,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET!,
//     }),
//     Naver({
//       clientId: process.env.NAVER_CLIENT_ID!,
//       clientSecret: process.env.NAVER_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }): Promise<JWT> {
//       // 최초 로그인 시 user가 존재
//       if (user) {
//         const u = user as unknown as AuthorizedUser;
//         token.accessToken = u.accessToken;
//         token.refreshToken = u.refreshToken;
//         token.role = u.role;
//         token.required = u.required;
//         token.accessTokenExpires = u.accessTokenExpires;
//         token.email = u.email ?? null;
//       }
//       return token;
//     },
//     async session({ session, token }): Promise<Session> {
//       // 세션에 커스텀 필드 주입 (모듈 보강으로 타입 안전)
//       session.accessToken =
//         typeof token.accessToken === "string" ? token.accessToken : undefined;
//       // session.refreshToken =
//       //   typeof token.refreshToken === "string" ? token.refreshToken : undefined;
//       session.role = typeof token.role === "string" ? token.role : undefined;
//       session.required =
//         typeof token.required === "boolean" ? token.required : undefined;
//       session.accessTokenExpires =
//         typeof token.accessTokenExpires === "number"
//           ? token.accessTokenExpires
//           : undefined;
//       // email은 next-auth가 Session.user.email에 복사하므로 별도 주입 불필요(이미 타입에 포함됨)
//       return session;
//     },
//   },
//   pages: { signIn: "/auth/login/" },
//   secret: process.env.NEXTAUTH_SECRET,
// });

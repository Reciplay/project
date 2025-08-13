// import axios from "axios";
// import FormData from "form-data";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import KakaoProvider from "next-auth/providers/kakao";
// import NaverProvider from "next-auth/providers/naver";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) {
//           return null;
//         }

//         try {
//           const formdata = new FormData();
//           formdata.append("username", credentials.email);
//           formdata.append("password", credentials.password);
//           const res = await axios.post(
//             "http://i13e104.p.ssafy.io:8080/api/v1/user/auth/login",
//             formdata,
//             {
//               headers: {
//                 ...formdata.getHeaders(),
//               },
//             },
//           );

//           const accessToken = res.headers.authorization;
//           const cookieString = res.headers["set-cookie"][0];
//           console.log(cookieString);
//           const refreshToken = cookieString.split("=")[1].split(";")[0];
//           const role = res.data.role;
//           const required = res.data.required;
//           const expires = res.headers.expires;

//           if (accessToken || refreshToken) {
//             const user = {
//               id: credentials.email,
//               email: credentials.email,
//               accessToken: accessToken,
//               refreshToken: refreshToken,
//               accessTokenExpires: expires,
//               role: role,
//               required: required,
//             };
//             return user;
//           } else {
//             return null;
//           }
//         } catch (error) {
//           console.error("Error during authorization:", error);
//           return null;
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     KakaoProvider({
//       clientId: process.env.KAKAO_CLIENT_ID!,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET!,
//     }),
//     NaverProvider({
//       clientId: process.env.NAVER_CLIENT_ID!,
//       clientSecret: process.env.NAVER_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//         token.role = user.role;
//         token.required = user.required;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.refreshToken = token.refreshToken as string;
//       session.role = token.role as string;
//       session.required = token.required as boolean;
//       if (token.email) {
//         session.user.email = token.email;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/login/",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
// ===== NextAuth Handler =====
import axios from "axios";
import FormData from "form-data";
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

// function parseExpiresToEpoch(expires?: string | string[]): number {
//   // 예: 'Wed, 14 Aug 2025 12:34:56 GMT'
//   if (!expires) return Date.now() + 60 * 60 * 1000; // 1h fallback
//   const s = Array.isArray(expires) ? expires[0] : expires;
//   const t = Date.parse(s);
//   return Number.isFinite(t) ? t : Date.now() + 60 * 60 * 1000;
// }

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // ✅ 시그니처: (credentials, req)
      async authorize(credentials) {
        if (!credentials) return null;

        const formdata = new FormData();
        formdata.append("username", credentials.email);
        formdata.append("password", credentials.password);

        try {
          const res = await axios.post(
            "http://i13e104.p.ssafy.io:8080/api/v1/user/auth/login",
            formdata,
            { headers: formdata.getHeaders() },
          );

          // ── 토큰/역할/만료 추출 ──────────────────────────────
          const accessToken = res.headers?.authorization; // 'Bearer ...' 예상
          const setCookie = res.headers?.["set-cookie"]; // [ 'refreshToken=...; Path=/; ...' ] 예상
          const refreshToken = Array.isArray(setCookie)
            ? setCookie[0]?.split(";")[0]?.split("=")[1]
            : undefined;

          const role = String(res.data?.role ?? "");
          const required = Boolean(res.data?.required ?? false);
          const accessTokenExpires = res.headers.expires;

          // ── 필수 값 검증 ─────────────────────────────────────
          if (!accessToken || !refreshToken) {
            // 필수 키가 없으면 로그인 실패로 처리
            return null;
          }

          // ✅ User 타입을 정확히 만족하도록 반환
          const user: User = {
            id: credentials.email,
            email: credentials.email,
            accessToken,
            refreshToken,
            accessTokenExpires,
            role,
            required,
          };

          return user;
        } catch (err) {
          console.error("Error during authorization:", err);
          return null;
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
      // 로그인 시점에만 user 존재
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.required = user.required;
        token.accessTokenExpires = user.accessTokenExpires;
        token.user = {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken ?? undefined;
      session.refreshToken = token.refreshToken ?? undefined;
      session.role = token.role ?? undefined;
      session.required = token.required ?? undefined;

      // ✅ user가 없을 때 타입을 만족하도록 id를 넣어 초기화
      session.user ??= {
        id:
          (typeof token.user?.id === "string" && token.user.id) ||
          (typeof token.email === "string" ? token.email : ""),
      };

      // 이후 필요한 필드들 채워넣기
      if (typeof token.email === "string") {
        session.user.email = token.email;
      }
      if (typeof token.user?.name === "string") {
        session.user.name = token.user.name;
      }
      if (typeof token.user?.image === "string") {
        session.user.image = token.user.image;
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

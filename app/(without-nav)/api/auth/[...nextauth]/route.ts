import axios from "axios";
import FormData from "form-data";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

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
          return null;
        }

        try {
          const formdata = new FormData();
          formdata.append("username", credentials.email);
          formdata.append("password", credentials.password);
          const res = await axios.post(
            "http://i13e104.p.ssafy.io:8080/api/v1/user/auth/login",
            formdata,
            {
              headers: {
                ...formdata.getHeaders(),
              },
            }
          );

          const accessToken = res.headers.authorization;
<<<<<<< HEAD
          const refreshToken = res.headers["set-cookie"][0];
=======
          const cookieString = res.headers["set-cookie"][0];
          console.log(cookieString)
          const refreshToken = cookieString.split("=")[1].split(';')[0];
>>>>>>> feature/taewook
          const role = res.data.role;
          const required = res.data.required;
          const expires = res.headers.expires;

          if (accessToken || refreshToken) {
            const user = {
              id: credentials.email,
              email: credentials.email,
              accessToken: accessToken,
              refreshToken: refreshToken,
              accessTokenExpires: expires,
              role: role,
              required: required,
            };
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
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
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.required = user.required;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.role = token.role as string;
      session.required = token.required as boolean;
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

// app/api/auth/[...nextauth]/route.ts
<<<<<<< Updated upstream
import axios from "axios";
import FormData from "form-data";
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND = "https://i13e104.p.ssafy.io/api/v1";

// 쿠키에서 refresh-token 추출
function pickRefreshToken(setCookie?: string[] | string) {
  if (!setCookie) return undefined;
  const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
  const hit = arr.find((c) => c.toLowerCase().startsWith("refresh-token="));
  return hit?.split(";")[0]?.split("=")[1];
}
=======
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
>>>>>>> Stashed changes

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        tokenLogin: { label: "Token Login", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        role: { label: "Role", type: "text" },
        required: { label: "Required", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

<<<<<<< Updated upstream
        // ① 소셜 콜백에서 programmatic 로그인
        if (credentials.tokenLogin === "1") {
          const email = credentials.email;
          const accessToken = credentials.accessToken;
          const refreshToken = credentials.refreshToken;
          const role = credentials.role;
          const required =
            credentials.required === "true" || credentials.required === "1";
=======
        // 백엔드 콜백을 통한 programmatic 로그인
        if ((credentials as any).tokenLogin === "1") {
          const email        = (credentials as any).email as string;
          const accessToken  = (credentials as any).accessToken as string;
          const refreshToken = (credentials as any).refreshToken as string;
          const role         = (credentials as any).role as string | undefined;
          const required     = ((credentials as any).required === "true");
>>>>>>> Stashed changes

          if (!email || !accessToken || !refreshToken) return null;

          return {
            id: email,
            email,
            accessToken,
            refreshToken,
            role,
            required,
<<<<<<< Updated upstream
            accessTokenExpires: Date.now() + 1000 * 60 * 15,
          } as User;
        }

        // ② 기존 아이디/비번 로그인
        const form = new FormData();
        form.append("username", credentials.email);
        form.append("password", credentials.password);
        console.log("요청 URL:", `${BACKEND}/user/auth/login`);
        try {
          const res = await axios.post(`${BACKEND}/user/auth/login`, form, {
            headers: form.getHeaders(),
            withCredentials: true,
          });

          const accessToken = res.headers?.authorization; // 'Bearer ...'
          const refreshToken = pickRefreshToken(res.headers?.["set-cookie"]);
          const role = String(res.data?.role ?? "");
          const required = Boolean(res.data?.required ?? false);

          if (!accessToken || !refreshToken) return null;

          return {
            id: credentials.email as string,
            email: credentials.email as string,
            accessToken,
            refreshToken,
            role,
            required,
            accessTokenExpires: Date.now() + 1000 * 60 * 15,
          } as User;
        } catch (e) {
          console.error("credentials login failed:", e);
          return null;
        }
=======
          } as any as User;
        }

        return null; // (아이디/비번 로그인 안 쓰면 그대로)
>>>>>>> Stashed changes
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
<<<<<<< Updated upstream
        token.accessToken = (
          user as User & { accessToken: string }
        ).accessToken;
        token.refreshToken = (
          user as User & { refreshToken: string }
        ).refreshToken;
        token.accessTokenExpires = (
          user as User & { accessTokenExpires: number }
        ).accessTokenExpires;
        token.role = (user as User & { role?: string }).role;
        token.required = (user as User & { required?: boolean }).required;
        token.user = {
=======
        (token as any).accessToken  = (user as any).accessToken;
        (token as any).refreshToken = (user as any).refreshToken;
        (token as any).role         = (user as any).role;
        (token as any).required     = (user as any).required;
        (token as any).user = {
>>>>>>> Stashed changes
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        };
      }
      return token;
    },
<<<<<<< Updated upstream
    async session({ session, token }): Promise<Session> {
      (session as Session & { accessToken?: string }).accessToken =
        token.accessToken as string;
      (session as Session & { refreshToken?: string }).refreshToken =
        token.refreshToken as string;
      (session as Session & { role?: string }).role = token.role as string;
      (session as Session & { required?: boolean }).required =
        token.required as boolean;
      (session as Session & { error?: string }).error = token.error as string;

      session.user ??= {
        id:
          token.user?.id ??
          (typeof token.email === "string" ? token.email : ""),
      } as Session["user"];
      if (typeof token.email === "string") session.user.email = token.email;
      if (token.user?.name) session.user.name = token.user.name;
      if (token.user?.image) session.user.image = token.user.image;

=======
    async session({ session, token }) {
      (session as any).accessToken  = (token as any).accessToken ?? undefined;
      (session as any).refreshToken = (token as any).refreshToken ?? undefined;
      (session as any).role         = (token as any).role ?? undefined;
      (session as any).required     = (token as any).required ?? undefined;

      session.user ??= {
        id: (token as any).user?.id ?? (typeof token.email === "string" ? token.email : ""),
      };
      if (typeof token.email === "string") session.user.email = token.email;
      if ((token as any).user?.name)  session.user.name  = (token as any).user.name;
      if ((token as any).user?.image) session.user.image = (token as any).user.image;
>>>>>>> Stashed changes
      return session;
    },
  },
  pages: { signIn: "api/login/" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

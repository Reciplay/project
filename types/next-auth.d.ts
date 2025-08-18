import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// ===== Module Augmentation =====
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    required?: boolean;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth" {
  interface Session {
    required?: boolean;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    required?: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number; // epoch(ms)
  }
}

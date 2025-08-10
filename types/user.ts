export interface User {
  activated: boolean;
  birthDate: string;
  createdAt: string;
  email: string;
  gender: number;
  profileImage: ProfileImage;
  job: string;
  name: string;
  nickname: string;
  levels: Record<string, number>;
}

export interface ProfileImage {
  name: string;
  presignedUrl: string;
  sequence: number;
}

export interface UserSummary {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserDetail extends UserSummary {
  role: boolean;
  job: string;
  nickname: string;
  birthDate: string;
}

export interface UserExtra {
  name: string;
  job: string;
  birthDate: string;
  gender: Gender;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmEmail: string;
}

export type Gender = 0 | 1;

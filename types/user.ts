export interface User {
  activated: boolean;
  birthDate: string;
  createdAt: string;
  email: string;
  gender: number;
  imgUrl: string;
  job: string;
  name: string;
  nickname: string;
  levels: Record<string, number>;
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

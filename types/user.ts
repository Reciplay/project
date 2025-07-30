export interface UserResponse {
  status: string;
  message: string;
  data: User;
}
export interface User {
  activated: boolean;
  birthDate: string; // ISO date string
  createdAt: string; // ISO datetime string
  email: string;
  gender: number; // 0: 여성, 1: 남성 등
  imgUrl: string;
  job: string;
  name: string;
  nickname: string;
  levels: {
    [key: string]: number;
  };
}

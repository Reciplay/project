import { UserResponse } from "@/types/user";

export const sampleUser: UserResponse = {
  status: "success",
  message: "사용자 정보 조회 성공",
  data: {
    activated: true,
    birthDate: "1998-05-15",
    createdAt: "2025-07-30T03:05:50.253Z",
    email: "jiyoun@example.com",
    gender: 0,
    imgUrl: "/images/profile.webp",
    job: "한식 셰프",
    name: "이지언",
    nickname: "지언쌤",
    levels: {
      korean: 3,
      japanese: 2,
      fusion: 1,
    },
  },
};

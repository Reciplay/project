import { ApiResponse } from "@/types/apiResponse";
import { ResponseLicense } from "@/types/license";

export const sampleLicenses: ApiResponse<ResponseLicense[]> = {
  status: "200",
  message: "자격증 데이터",
  data: [
    { id: 1, name: "한식조리기능사" },
    { id: 2, name: "양식조리기능사" },
    { id: 3, name: "중식조리기능사" },
    { id: 4, name: "일식조리기능사" },
    { id: 5, name: "복어조리기능사" },
    { id: 6, name: "제과기능사" },
    { id: 7, name: "제빵기능사" },
    { id: 8, name: "조리산업기사(한식)" },
    { id: 9, name: "조리산업기사(양식)" },
    { id: 10, name: "조리산업기사(중식)" },
    { id: 11, name: "조리산업기사(일식)" },
    { id: 12, name: "떡제조기능사" },
    { id: 13, name: "조주기능사" },
    { id: 14, name: "영양사" },
    { id: 15, name: "위생사" },
    { id: 16, name: "식품기술사" },
    { id: 17, name: "식품위생관리사" },
    { id: 18, name: "바리스타 1급" },
    { id: 19, name: "바리스타 2급" },
    { id: 20, name: "조리기능장" },
  ]
}

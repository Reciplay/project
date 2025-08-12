import { Instructor } from "@/types/instructor";

export const sampleInstructor: Instructor = {
  id: 0,
  name: "이지언",
  profileImage: "/images/profile.jpg",
  coverImage: "/images/instructor-banner.png",
  introduction:
    "안녕하세요, 한식 요리를 사랑하는 셰프 이지언입니다. 10년 이상 강의 경험을 통해 누구나 쉽게 요리를 배울 수 있도록 도와드릴게요!",
  licenses: [
    {
      id: 1,
      licenseName: "한식조리기능사",
      institution: "대한조리협회",
      acquisitionDate: "2025-01-01",
      grade: 1,
    },
    {
      id: 2,
      licenseName: "조리교육 전문가 1급",
      institution: "한국조리인증원",
      acquisitionDate: "2025-01-01",
      grade: 1,
    },
  ],
  careers: [
    {
      id: 1,
      companyName: "W호텔",
      position: "부총주방장",
      jobDescription: "한식 부문 메뉴 개발 및 주방 총괄",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
    },
    {
      id: 2,
      companyName: "서울현대전문학교",
      position: "외식산업계열 학장",
      jobDescription: "한식 및 외식산업 교육 커리큘럼 총괄",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
    },
  ],
  subscriberCount: 3421,
  isSubscribed: true,
};

import { Instructor } from "@/app/(with-nav)/(main-center)/instructor/[instructorId]/introduce/__components/bannerProfile/bannerProfile";
import { Course } from "@/types/course";

export const sampleInstructors: Instructor[] = [
  {
    id: 0,
    name: "김도윤",
    thumbnail: "/images/김도윤.webp",
    subscribers: 210000,
  },
  {
    id: 1,
    name: "김승민",
    thumbnail: "/images/김승민.webp",
    subscribers: 210000,
  },
  {
    id: 2,
    name: "남정석",
    thumbnail: "/images/남정석.webp",
    subscribers: 210000,
  },
  {
    id: 3,
    name: "박준우",
    thumbnail: "/images/박준우.webp",
    subscribers: 210000,
  },
  {
    id: 4,
    name: "방기수",
    thumbnail: "/images/방기수.webp",
    subscribers: 210000,
  },
  // ...
];

// export const sampleCourse: Course = {
//   id: 1,
//   title:
//     "이탈리아 현지 미슐랭 요리사에게 배우는 파스타, 뇨끼, 리조또! 프리미 피아띠 정복하기",
//   instructorId: 101,
//   instructorName: "김밀란",
//   thumbnail: "/images/cook2.jpg",

//   category: "이탈리아 요리",
//   difficulty: 122,
//   summary:
//     "전채, 파스타, 해산물, 고기요기 그리고 마지막 디저트로 완성된 5코스 요리. 플레이팅까지 근사한 홈 파티에 최적화된 요리들로 준비했습니다.",
//   learningPoints: [
//     "파스타 만들기",
//     "뇨끼 반죽과 조리",
//     "리조또 기본과 응용",
//     "5코스 구성 이해",
//     "홈 파티용 플레이팅",
//   ],

//   ratingAvg: 4.0,
//   isLive: true,
//   viewerCount: 8,

//   startDate: "2025-08-10",
//   endDate: "2025-09-10",

//   isEnrolled: false,
// };

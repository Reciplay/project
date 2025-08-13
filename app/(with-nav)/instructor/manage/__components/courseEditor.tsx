// import BaseInput from "@/components/input/baseInput";
// import VerticalTabs from "@/components/tab/verticalTab";
// import { sampleCourse1 } from "@/config/sampleCourse";
// import CourseTable from "./courseTable";

// export default function CourseEditor() {
//   return (
//     <VerticalTabs
//       data={sampleCourse1}
//       getKey={(c) => c.key}
//       getLabel={(c) => c.label}
//       renderContent={(selected) => (
//         <>
//           <h2>강좌 명</h2>
//           <BaseInput placeholder="강좌명을 입력해주세요." type="" value={selected.label} />

//           <h2>강좌 분야</h2>
//           <BaseInput placeholder="분야를 선택해주세요." type="" value={selected.category} />

//           <h2>강좌 소개</h2>
//           <BaseInput placeholder="강좌를 소개해주세요." type="" value={selected.introduce} />

//           <h2>강좌 요약</h2>
//           <BaseInput placeholder="강좌를 요약해주세요." type="" value={selected.bio} />

//           <CourseTable />
//         </>
//       )}
//     />
//   );
// }

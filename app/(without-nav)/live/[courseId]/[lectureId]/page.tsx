'use client';

import { useSession } from 'next-auth/react';
import InstructorPage from './__component/instructor/instructorPage';
import StudentPage from './__component/student/studentPage';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null; // 로딩 스켈레톤 넣어도 OK
  if (!session) return <div>로그인이 필요합니다.</div>;

  const role = (session as any).role ?? (session as any).user?.role;

  return role === 'ROLE_STUDENT' ? <StudentPage /> : <InstructorPage />;
}


// import { getSession } from "next-auth/react";
// import InstructorPage from "./__component/instructor/instructorPage";
// import StudentPage from "./__component/student/studentPage";
// import restClient from "@/lib/axios/restClient";
// import { ApiResponse } from "@/types/apiResponse";

// export default async function Page() {
//   const session = await getSession();
//   if (session?.role === null) {
//     return <div></div>
//   }
//   return (
//     <>
//       {session?.role === 'ROLE_STUDENT' ? <StudentPage /> : <InstructorPage />}
//     </>
//   )
// }



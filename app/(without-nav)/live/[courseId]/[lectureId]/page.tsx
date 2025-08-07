
import { getSession } from "next-auth/react";
import InstructorPage from "./__component/instructor/instructorPage";
import StudentPage from "./__component/student/studentPage";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";


export default async function Page() {
  const session = await getSession();
  if (session?.role === null) {
    return <div></div>
  }
  return (
    <>
      {session?.role === 'ROLE_STUDENT' ? <StudentPage /> : <InstructorPage />}
    </>
  )
}
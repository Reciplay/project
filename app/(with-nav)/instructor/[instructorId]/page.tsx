import { sampleInstructor } from "@/config/sampleInstructor";
import { InstructorResponse } from "@/types/instructor";
import { AxiosError } from "axios";
import InstructorProfile from "./__components/InstructorProfile/InstructorProfile";

interface PageProps {
  params: {
    instructorId: string;
  };
}

const getInstructorProfile = async (
  instructorId: string
): Promise<InstructorResponse> => {
  try {
    // const response = await axiosInstance.get<InstructorResponse>(
    //   "/api/v1/user/instructor/profile"
    // );
    // return response.data;

    return sampleInstructor;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error("강사 프로필 불러오기 실패", axiosError);

    // 에러 응답이 있는 경우 메시지 추출
    throw new Error(axiosError.response?.data?.message || "서버 오류");
  }
};
export default async function Page({ params }: PageProps) {
  const { instructorId } = await params;

  const res: InstructorResponse = await getInstructorProfile(instructorId);

  if (res != null) {
    return <InstructorProfile props={res.data} />;
  }

  // fallback 처리 (없으면 Next.js에서 "nothing rendered" 오류)
  return <div>강사 정보를 불러올 수 없습니다.</div>;
}

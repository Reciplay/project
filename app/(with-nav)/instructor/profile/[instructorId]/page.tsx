"use client";

import { useInstructorProfile } from "@/hooks/instructor/useInstructorProfile";
import { useParams } from "next/navigation";
import InstructorProfile from "./__components/InstructorProfile/InstructorProfile";

export default function Page() {
  const { instructorId } = useParams<{ instructorId: string }>();
  const { instructor, loading, message } = useInstructorProfile(instructorId);

  if (loading) return <div>불러오는 중…</div>;
  if (!instructor)
    return <div>{message ?? "강사 정보를 불러올 수 없습니다."}</div>;

  return <InstructorProfile instructor={instructor} />;
}

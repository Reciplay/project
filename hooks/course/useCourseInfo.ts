"use client";

import { sampleCourseDetail } from "@/config/sampleCourse";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { CourseDetail } from "@/types/course";
import { useEffect, useState } from "react";

export function useCourseInfo(courseId?: string) {
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    if (!courseId) {
      setLoading(false);
      setMessage("유효하지 않은 강좌 ID입니다.");
      setCourseDetail(sampleCourseDetail); // 필요 없으면 null로 바꿔도 됨
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await restClient.get<ApiResponse<CourseDetail>>(
          "/course/courses",
          {
            params: { courseId: Number(courseId) },
            requireAuth: true,
            validateStatus: () => true, // 400/404도 catch로 안 떨어지게
          }
        );

        if (!alive) return;

        if (res.status === 400) {
          setMessage(res.data?.message ?? "잘못된 요청입니다.");
          // setCourseDetail(null);
          setCourseDetail(sampleCourseDetail);
          return;
        }

        if (res.status === 404) {
          // 리소스 없으면 샘플로 대체 (원치 않으면 null 처리)
          setMessage(res.data?.message ?? "해당 강좌를 찾을 수 없습니다.");
          setCourseDetail(sampleCourseDetail);
          return;
        }

        // 200
        setCourseDetail(res.data.data ?? sampleCourseDetail);
      } catch {
        if (!alive) return;
        // 실패 시 더미 데이터
        setCourseDetail(sampleCourseDetail);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      alive = false;
    };
  }, [courseId]);

  return { courseDetail, loading, message };
}

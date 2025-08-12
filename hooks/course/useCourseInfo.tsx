"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { CourseDetail } from "@/types/course"; // 경로 맞춰주세요
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type UseCourseInfoResult = {
  courseDetail: CourseDetail | null;
  loading: boolean;
  status?: number; // 200 | 400 | 404 등
  message?: string | null;
};

export function useCourseInfo(): UseCourseInfoResult {
  const { courseId } = useParams<{ courseId: string }>();

  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (!courseId) {
          if (cancelled) return;
          setStatus(400);
          setMessage("유효하지 않은 강좌 ID입니다.");
          setCourseDetail(null);
          setLoading(false);
          return;
        }

        if (!cancelled) {
          setLoading(true);
          setMessage(null);
        }

        const res = await restClient.get<ApiResponse<CourseDetail>>(
          "/course/courses",
          {
            params: { courseId },
            requireAuth: false,
            validateStatus: () => true, // 400/404도 catch로 안 떨어지게
          }
        );

        if (cancelled) return;

        setStatus(res.status);

        if (res.status === 200) {
          setCourseDetail(res.data.data);
          setMessage(null);
        } else if (res.status === 400) {
          setCourseDetail(null);
          setMessage(res.data?.message ?? "잘못된 요청입니다.");
        } else if (res.status === 404) {
          setCourseDetail(null);
          setMessage(res.data?.message ?? "해당 강좌를 찾을 수 없습니다.");
        } else {
          setCourseDetail(null);
          setMessage(
            res.data?.message ?? "강좌 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
      } catch {
        if (cancelled) return;
        setStatus(undefined);
        setCourseDetail(null);
        setMessage("네트워크 오류가 발생했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { courseDetail, loading, status, message };
}

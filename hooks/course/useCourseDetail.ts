import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { CourseDetail } from "@/types/course";
import { useCallback, useEffect, useState } from "react";

export const useCourseDetail = (courseId: number | null) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await restClient.get<ApiResponse<CourseDetail>>(
        `/course/courses?courseId=${courseId}`,
        { requireAuth: true, useCors: false },
      );
      if (res.data.status === "success") {
        setCourse(res.data.data);
      } else {
        setError(res.data.message || "강좌 상세 정보 조회 실패");
      }
    } catch (err) {
      console.error("Error fetching course detail:", err);
      setError(getErrorMessage(err, "강좌 상세 정보 조회 실패"));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, fetchCourse };
};

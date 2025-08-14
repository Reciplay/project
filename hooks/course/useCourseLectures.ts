import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import type { LectureSummary } from "@/types/lecture";
import { useCallback, useEffect, useState } from "react";

export const useCourseLectures = (courseId: number) => {
  const [lectures, setLectures] = useState<LectureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLectures = useCallback(async () => {
    if (!courseId) {
      setLectures([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await restClient.get(`/course/lecture/summaries`, {
        params: { courseId },
        requireAuth: true,
      });
      setLectures(response.data?.data || []);
    } catch (e) {
      setError(getErrorMessage(e, "강의 목록을 불러오는 데 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return { lectures, loading, error, refetch: fetchLectures };
};

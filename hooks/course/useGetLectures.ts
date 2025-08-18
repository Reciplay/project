import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { LectureSummary } from "@/types/lecture";
import { useCallback, useEffect, useState } from "react";

export const useGetLectures = (courseId: number) => {
  const [data, setData] = useState<LectureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLectures = useCallback(async () => {
    if (!courseId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await restClient.get<ApiResponse<LectureSummary[]>>(
        `/course/lecture/summaries`,
        {
          params: { courseId },
          requireAuth: true,
        },
      );
      setData(response.data?.data);
    } catch (e) {
      setError(getErrorMessage(e, "강의 목록을 조회 할 수 없습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return { data, loading, error, refetch: fetchLectures };
};

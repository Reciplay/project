import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useCallback, useEffect, useState } from "react";

export const useGetLevel = (courseId: number) => {
  const [data, setData] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLevel = useCallback(async () => {
    if (!courseId) {
      setData(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await restClient.get<ApiResponse<number>>(
        `/user/lecture-history/progree`,
        {
          params: { courseId },
          requireAuth: true,
        },
      );
      setData(response.data?.data);
    } catch (e) {
      setError(getErrorMessage(e, "진행률을 조회 할 수 없습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel]);

  return { data, loading, error, refetch: fetchLevel };
};

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { useCallback, useEffect, useState } from "react";

export const useGetLive = (courseId: number) => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLive = useCallback(async () => {
    if (!courseId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await restClient.get(`/course/lecture/coming`, {
        params: { courseId },
        requireAuth: true,
      });
      setData(response.data?.data);
    } catch (e) {
      setError(getErrorMessage(e, "라이브가 없습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  return { data, loading, error, refetch: fetchLive };
};

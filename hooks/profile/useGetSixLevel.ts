import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useCallback, useEffect, useState } from "react";

interface Level {
  category: string;
  categoryId: number;
  level: number;
}

export const useGetSixLevel = () => {
  const [data, setData] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSixLevel = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await restClient.get<ApiResponse<Level[]>>(
        `/user/profile/levels`,
        {
          requireAuth: true,
        },
      );
      setData(response.data?.data);
    } catch (e) {
      setError(getErrorMessage(e, "역량을 조회 할 수 없습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSixLevel();
  }, [fetchSixLevel]);

  return { data, loading, error, refetch: fetchSixLevel };
};

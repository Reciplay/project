import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { SubscriptionPoint } from "@/types/instructorStats";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";

export type SubscriptionCriteria = "daily" | "weekly" | "monthly" | "yearly";

export const useSubscriptionTrend = (criteris: SubscriptionCriteria) => {
  const [trendData, setTrendData] = useState<SubscriptionPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = qs.stringify({ criteris: criteris }, { encode: true });
      const res = await restClient.get<ApiResponse<SubscriptionPoint[]>>(
        `/user/instructor/subscriber?${params}`,
        { requireAuth: true, useCors: false },
      );
      if (res.data.status === "success") {
        setTrendData(res.data.data);
      } else {
        setError(res.data.message || "구독자 추이 데이터 조회 실패");
      }
    } catch (e) {
      console.error("Error fetching subscription trend:", e);
      setError(getErrorMessage(e, "구독자 추이 데이터 조회 실패"));
    } finally {
      setLoading(false);
    }
  }, [criteris]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { trendData, loading, error, fetchTrend };
};

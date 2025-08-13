import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { SubscriptionPoint } from "@/types/instructorStats";
import { useState, useEffect, useCallback } from "react";
import qs from "qs";

export type SubscriptionCriteria = "daily" | "weekly" | "monthly" | "yearly";

export const useSubscriptionTrend = (criteria: SubscriptionCriteria) => {
  const [trendData, setTrendData] = useState<SubscriptionPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = qs.stringify({ criteris: criteria }, { encode: true });
      const res = await restClient.get<ApiResponse<SubscriptionPoint[]>>(
        `/user/instructor/subscription?${params}`,
        { requireAuth: true, useCors: false }
      );
      if (res.data.status === "success") {
        setTrendData(res.data.data);
      } else {
        setError(res.data.message || "구독자 추이 데이터 조회 실패");
      }
    } catch (err: any) {
      console.error("Error fetching subscription trend:", err);
      setError(err?.response?.data?.message || "구독자 추이 데이터 조회 실패");
    } finally {
      setLoading(false);
    }
  }, [criteria]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { trendData, loading, error, fetchTrend };
};

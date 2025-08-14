// hooks/instructor/useInstructorStats.ts
"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { InstructorStats } from "@/types/instructorStats";
import { useCallback, useEffect, useState } from "react";

export function useInstructorStats() {
  const [data, setData] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.get<ApiResponse<InstructorStats>>(
        "/user/instructor/statistic", // Corrected endpoint
        { requireAuth: true }, // Added useCors: false based on restClient.ts
      );

      setData(res.data?.data);
    } catch (e) {
      setError(getErrorMessage(e, "강사 통계 조회 실패"));
      setData(null); // Removed dummy data fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refresh: fetchStats,
  };
}

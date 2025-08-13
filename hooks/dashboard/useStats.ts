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
        { requireAuth: true, useCors: false }, // Added useCors: false based on restClient.ts
      );
      console.log(res.data?.data);
      const body = res.data?.data as InstructorStats;
      const fixed = {
        ...body,
        totalReviewCount: body.totalReviewCount ?? 0,
      } as InstructorStats;

      setData(fixed);
    } catch (e) {
      // Added any type for error
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
    // 편의 파생값
    totalStudents: data?.totalStudents ?? 0,
    averageStars: data?.averageStars ?? 0,
    totalReviewCount: data?.totalReviewCount ?? 0,
    subscriberCount: data?.subscriberCount ?? 0,
    profileImageUrl: data?.profileFileInfo?.presignedUrl ?? "", // Adjusted to profileFileInfo.presignedUrl
    newQuestions: data?.newQuestions ?? [],
  };
}

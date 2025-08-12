// hooks/instructor/useInstructorStats.ts
"use client";

import { dummyInstructorStats } from "@/config/sampleQuestion";
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
        "/user/instructor/statisic",
        { requireAuth: true },
      );
      console.log(res.data?.data);
      const body = res.data?.data as InstructorStats;
      const fixed = {
        ...body,
        totalReviewCount: body.totalReviewCount ?? 0,
      } as InstructorStats;

      setData(fixed);
    } catch (e) {
      setError(e?.response?.data?.message || "강사 통계 조회 실패");
      setData(dummyInstructorStats);
      // setData(null);
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
    profileImageUrl: data?.profileImageUrl ?? "",
    newQuestions: data?.newQuestions ?? [],
  };
}

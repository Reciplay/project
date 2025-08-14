"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import type { ApiResponse } from "@/types/apiResponse";
import { useState } from "react";

export interface RegisterCourseReviewRequest {
  courseId: number;
  stars: number;
  review: string;
}

type UseRegisterCourseReviewResult = {
  loading: boolean;
  message: string | null;
  error: string | null;
  registerReview: (data: RegisterCourseReviewRequest) => Promise<void>;
};

export function useRegisterCourseReview(): UseRegisterCourseReviewResult {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const registerReview = async (data: RegisterCourseReviewRequest) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await restClient.post<ApiResponse<object>>(
        "/user/review",
        data,
        {
          requireAuth: true,
        },
      );

      if (response.data.status === "201") {
        setMessage(response.data.message);
      } else {
        const errMsg = response.data.message ?? "수강평 등록에 실패했습니다.";
        setError(errMsg);
        alert(errMsg); // 실패 시 바로 알림
      }
    } catch (e) {
      const errMsg = getErrorMessage(e, "네트워크 오류가 발생했습니다.");
      setError(errMsg);
      alert(errMsg); // 네트워크 오류 알림
    } finally {
      setLoading(false);
    }
  };

  return { loading, message, error, registerReview };
}

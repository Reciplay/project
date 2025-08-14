"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { message } from "antd";
import { useCallback, useState } from "react";

export type PostQnaAnswerRequest = {
  questionId: number;
  courseId: number;
  content: string;
};

export function usePostQnaAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const postAnswer = useCallback(async (payload: PostQnaAnswerRequest) => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.post<ApiResponse<null>>(
        "/course/qna/answer",
        payload,
        { requireAuth: true },
      );

      if (res.status >= 200 && res.status < 300) {
        message.success(
          res.data?.message || "답변이 성공적으로 등록되었습니다.",
        );
        return true;
      } else {
        const msg = res.data?.message || "답변 등록에 실패했습니다.";
        message.error(msg);
        setError(msg);
        return false;
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "답변 등록 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { postAnswer, loading, error };
}

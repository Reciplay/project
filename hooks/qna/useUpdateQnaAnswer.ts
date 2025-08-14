"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { message } from "antd";
import { useCallback, useState } from "react";

export type UpdateQnaAnswerRequest = {
  questionId: number;
  courseId: number;
  content: string;
};

export function useUpdateQnaAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const updateAnswer = useCallback(async (payload: UpdateQnaAnswerRequest) => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.put<ApiResponse<null>>(
        "/course/qna/answer",
        payload,
        { requireAuth: true },
      );

      if (res.status >= 200 && res.status < 300) {
        message.success(
          res.data?.message || "답변이 성공적으로 수정되었습니다.",
        );
        return true;
      } else {
        const msg = res.data?.message || "답변 수정에 실패했습니다.";
        message.error(msg);
        setError(msg);
        return false;
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "답변 수정 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateAnswer, loading, error };
}

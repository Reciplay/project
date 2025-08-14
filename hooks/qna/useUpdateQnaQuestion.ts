"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { message } from "antd";
import { useCallback, useState } from "react";

export type UpdateQnaQuestionRequest = {
  courseId: number;
  qnaId: number;
  title: string;
  questionContent: string;
};

export function useUpdateQnaQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const updateQuestion = useCallback(
    async (payload: UpdateQnaQuestionRequest) => {
      setLoading(true);
      setError("");

      try {
        const res = await restClient.put<ApiResponse<null>>(
          "/course/qna/question",
          payload,
          { requireAuth: true },
        );

        if (res.status >= 200 && res.status < 300) {
          message.success(
            res.data?.message || "질문이 성공적으로 수정되었습니다.",
          );
          return true;
        } else {
          const msg = res.data?.message || "질문 수정에 실패했습니다.";
          message.error(msg);
          setError(msg);
          return false;
        }
      } catch (e) {
        const errorMessage = getErrorMessage(
          e,
          "질문 수정 중 오류가 발생했습니다.",
        );
        setError(errorMessage);
        message.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateQuestion, loading, error };
}

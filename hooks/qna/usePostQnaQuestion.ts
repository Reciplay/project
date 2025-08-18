"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { message } from "antd";
import { useCallback, useState } from "react";

export type PostQnaQuestionRequest = {
  title: string;
  questionContent: string;
  courseId: number;
};

export function usePostQnaQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const postQuestion = useCallback(async (payload: PostQnaQuestionRequest) => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.post<ApiResponse<null>>(
        "/course/qna/question",
        payload,
        { requireAuth: true },
      );

      if (res.status === 201) {
        message.success(
          res.data?.message || "질문이 성공적으로 등록되었습니다.",
        );
        return true;
      } else {
        const msg = res.data?.message || "질문 등록에 실패했습니다.";
        message.error(msg);
        setError(msg);
        return false;
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "질문 등록 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { postQuestion, loading, error };
}

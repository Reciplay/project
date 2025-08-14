"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { QnaDetail } from "@/types/qna";
import { useCallback, useEffect, useState } from "react";

export function useQnaDetail(qnaId: number) {
  const [data, setData] = useState<QnaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchDetail = useCallback(async (id: number) => {
    if (!id) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await restClient.get<ApiResponse<QnaDetail>>(
        `/course/qna`,
        {
          params: { qnaId: id },
          useCors: false,
        },
      );

      if (response.data.status === "success" || response.status < 300) {
        setData(response.data.data);
      } else {
        const errorMessage =
          response.data.message || "Q&A 상세 정보를 불러오는 데 실패했습니다.";
        setError(errorMessage);
        setData(null);
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "Q&A 상세 정보를 불러오는 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetail(qnaId);
  }, [qnaId, fetchDetail]);

  const refetch = useCallback(() => {
    fetchDetail(qnaId);
  }, [qnaId, fetchDetail]);

  return { data, loading, error, refetch };
}

"use client";

import { sampleQna } from "@/config/sampleQna";
import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { QnA } from "@/types/qna";
import { useCallback, useEffect, useState } from "react";

type UseQnaSummaryResult = {
  list: QnA[];
  loading: boolean;
  message: string | null;
  page: number;
  totalPages: number;
  setPage: (pageNum: number) => void;
  reload: () => void;
};

export function useQnaSummary(
  courseId?: string,
  pageSize = 5,
): UseQnaSummaryResult {
  const [allData, setAllData] = useState<QnA[]>([]);
  const [list, setList] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAll = useCallback(async () => {
    if (!courseId) {
      setMessage("유효하지 않은 강좌 ID입니다.");
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await restClient.get<ApiResponse<QnA[]>>(
        "/course/qna/summaries",
        {
          params: { courseId: Number(courseId) },
          requireAuth: true,
        },
      );

      if (res.status === 200 && Array.isArray(res.data?.data)) {
        const data = res.data.data;
        setAllData(data);
        setTotalPages(Math.ceil(data.length / pageSize));
        setPage(1); // 첫 페이지
      } else {
        setMessage(res.data?.message ?? "Q&A 정보를 불러올 수 없습니다.");
        setAllData([]);
      }
    } catch (e) {
      setMessage(getErrorMessage(e, "네트워크 오류가 발생했습니다."));
      setAllData([]);
    } finally {
      setLoading(false);
      if (process.env.NODE_ENV === "development") {
        setAllData(sampleQna);
        setTotalPages(Math.ceil(sampleQna.length / pageSize));
      }
    }
  }, [courseId, pageSize]);

  // 전체 데이터 최초 로드
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 페이지 변경 시 현재 페이지 slice
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setList(allData.slice(start, end));
  }, [page, allData, pageSize]);

  return {
    list,
    loading,
    message,
    page,
    totalPages,
    setPage,
    reload: fetchAll,
  };
}

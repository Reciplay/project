"use client";

import { sampleQna } from "@/config/sampleQna";
import restClient from "@/lib/axios/restClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { QnA } from "@/types/qna";
import { useCallback, useEffect, useRef, useState } from "react";

type UseQnaSummaryResult = {
  list: QnA[];
  loading: boolean;
  message: string | null;
  hasMore: boolean;
  fetchNextPage: () => Promise<void>;
};

export function useQnaSummary(
  courseId?: string,
  pageSize = 5
): UseQnaSummaryResult {
  const [list, setList] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false); // 중복요청 가드

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (!courseId) {
        setMessage("유효하지 않은 강좌 ID입니다.");
        setHasMore(false);
        return;
      }
      if (inFlightRef.current) return;

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        inFlightRef.current = true;
        setLoading(true);
        setMessage(null);

        const res = await restClient.get<ApiResponse<QnA[]>>(
          "/course/qna/summaries",
          {
            params: {
              courseId: Number(courseId),
              page: pageNum,
              size: pageSize,
            },
            requireAuth: true,
            signal: ac.signal,
          }
        );

        if (res.status === 200 && Array.isArray(res.data?.data)) {
          const newItems = res.data.data;
          setList((prev) =>
            pageNum === 0 ? newItems : [...prev, ...newItems]
          );
          setHasMore(newItems.length === pageSize);
        } else if (res.status === 400) {
          setMessage(res.data?.message ?? "잘못된 요청입니다.");
          if (pageNum === 0) setList([]);
          setHasMore(false);
        } else {
          setMessage(
            res.data?.message ?? "Q&A 요약 정보를 불러올 수 없습니다."
          );
          if (pageNum === 0) setList([]);
          setHasMore(false);
        }
      } catch (e) {
        if (e?.name !== "CanceledError") {
          setMessage("네트워크 오류가 발생했습니다.");
          if (pageNum === 0) setList([]);
          setHasMore(false);
        }
      } finally {
        inFlightRef.current = false;
        setLoading(false);
        setList(sampleQna);
      }
    },
    [courseId, pageSize]
  );

  // 최초 5개 로드
  useEffect(() => {
    setList([]);
    setHasMore(true);
    setMessage(null);
    pageRef.current = 0;

    fetchPage(0).then(() => {
      pageRef.current = 1; // 다음 더보기는 1페이지부터
    });

    return () => abortRef.current?.abort();
  }, [courseId, pageSize, fetchPage]);

  const fetchNextPage = useCallback(async () => {
    if (!hasMore) return;
    const next = pageRef.current;
    await fetchPage(next);
    pageRef.current = next + 1;
  }, [hasMore, fetchPage]);

  return { list, loading, message, hasMore, fetchNextPage };
}

"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import type { ApiResponse } from "@/types/apiResponse";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CourseReview {
  reviewId: number;
  profileImage: string;
  nickname: string;
  userId: number;
  content: string;
  createdAt: string;
  likeCount: number;
}

type UseGetCourseReviewResult = {
  list: CourseReview[];
  loading: boolean;
  message: string | null;
  hasMore: boolean;
  fetchNextPage: () => Promise<void>;
  reload: () => void;
};

export function useGetCourseReview(
  courseId?: number,
  pageSize = 5,
): UseGetCourseReviewResult {
  const [list, setList] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

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

        const res = await restClient.get<ApiResponse<CourseReview[]>>(
          "/user/review",
          {
            params: {
              coursdId: courseId,
              page: pageNum,
              size: pageSize,
              //   sort: JSON.parse(stringifiedSort),
            },
            requireAuth: true,
            // signal: ac.signal, // 원하면 AbortController 적용 가능
          },
        );

        if (res.status === 200 && Array.isArray(res.data?.data)) {
          const newItems = res.data.data;
          setList((prev) =>
            pageNum === 0 ? newItems : [...prev, ...newItems],
          );
          setHasMore(newItems.length === pageSize);
        } else {
          setMessage(res.data?.message ?? "수강평을 불러올 수 없습니다.");
          if (pageNum === 0) setList([]);
          setHasMore(false);
        }
      } catch (e) {
        setMessage(getErrorMessage(e, "네트워크 오류가 발생했습니다."));
        if (pageNum === 0) setList([]);
        setHasMore(false);
      } finally {
        inFlightRef.current = false;
        setLoading(false);
      }
    },
    [courseId, pageSize],
  );

  // 최초 로드
  useEffect(() => {
    setList([]);
    setHasMore(true);
    setMessage(null);
    pageRef.current = 0;
    fetchPage(0).then(() => {
      pageRef.current = 1;
    });
    return () => abortRef.current?.abort();
  }, [fetchPage]);

  // 다음 페이지 로드
  const fetchNextPage = useCallback(async () => {
    if (!hasMore) return;
    const next = pageRef.current;
    await fetchPage(next);
    pageRef.current = next + 1;
  }, [hasMore, fetchPage]);

  // 새로고침
  const reload = useCallback(() => {
    setList([]);
    setHasMore(true);
    setMessage(null);
    pageRef.current = 0;
    fetchPage(0).then(() => {
      pageRef.current = 1;
    });
  }, [fetchPage]);

  return { list, loading, message, hasMore, fetchNextPage, reload };
}

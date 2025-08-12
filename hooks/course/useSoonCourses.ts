// hooks/course/soon/useSoonCourses.ts
"use client";

import type { CourseCard } from "@/types/course";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuery,
  CourseCardCondition,
  fetchCards,
  Pageable,
} from "./useCommonUtils";

export function useSoonCourses(options?: {
  initialPage?: number;
  size?: number;
  sort?: string[];
}) {
  const size = options?.size ?? 20;
  const sort = options?.sort;
  const initialPage = options?.initialPage ?? 0;

  const [list, setList] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasNext, setHasNext] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);

  const cond: CourseCardCondition = useMemo(
    () => ({ requestCategory: "soon" }),
    [],
  );
  const pageable: Pageable = useMemo(
    () => ({ page, size, sort }),
    [page, size, sort],
  );

  const loadPage = useCallback(
    async (targetPage: number) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      try {
        setLoading(true);
        setMessage(null);
        const params = buildQuery(cond, { ...pageable, page: targetPage });
        const res = await fetchCards(
          params,
          true,
          controllerRef.current.signal,
        );
        if (res.status === 200) {
          const d = res.data.data;
          const content = d.content ?? [];

          // 누적
          setList((prev) =>
            targetPage === 0 ? content : [...prev, ...content],
          );
          setTotalPages(d.totalPages ?? 1);
          setTotalElements(d.totalElements ?? 0);
          setHasNext(d.hasNext ?? targetPage + 1 < (d.totalPages ?? 1));
          setPage(targetPage);
        } else {
          setMessage(res.data?.message ?? "목록을 불러오지 못했어요.");
        }
      } catch (e) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        setMessage(
          e?.response?.data?.message ?? "네트워크 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    },
    [cond, pageable],
  );

  useEffect(() => {
    // 초기 로드 (0페이지)
    loadPage(0);
    return () => controllerRef.current?.abort();
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loading || !hasNext) return;
    await loadPage(page + 1);
  }, [loading, hasNext, page, loadPage]);

  const refetch = useCallback(async () => {
    await loadPage(0);
  }, [loadPage]);

  return {
    list,
    loading,
    message,
    hasNext,
    totalPages,
    totalElements,
    page,
    loadMore,
    refetch,
  };
}

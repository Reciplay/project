// hooks/course/useCourseCards.ts
"use client";

import restClient from "@/lib/axios/restClient";
import { PaginationResponse } from "@/types/apiResponse";
import type { CourseCard, RequestCategory } from "@/types/course";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// export type RequestCategory =
//   | "soon"
//   | "special"
//   | "popular"
//   | "latest"
//   | "enrolled"
//   | string;

export interface CourseCardCondition {
  requestCategory?: RequestCategory;
  searchContent?: string;
  instructorId?: number;
  isEnrolled?: boolean;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export function useCourseCards(options?: {
  initialCondition?: CourseCardCondition;
  initialPage?: number;
  size?: number;
  sort?: string[];
  requireAuth?: boolean;
  debounceMs?: number;
}) {
  const {
    initialCondition = {},
    initialPage = 0,
    size = 20,
    sort = [],
    requireAuth = false,
    debounceMs = 300,
  } = options ?? {};

  const [condition, setCondition] =
    useState<CourseCardCondition>(initialCondition);
  const [pageable, setPageable] = useState<Required<Pageable>>({
    page: initialPage,
    size,
    sort,
  });

  const [list, setList] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const hasNext = useMemo(
    () => pageable.page + 1 < totalPages,
    [pageable.page, totalPages],
  );

  const controllerRef = useRef<AbortController | null>(null);
  const debouncedCond = useDebouncedCondition(condition, debounceMs);

  const fetchPage = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const res = await restClient.get<PaginationResponse<CourseCard>>(
          "/course/courses/cards",
          {
            requireAuth: true,
            signal: controller.signal,
            params: {
              requestCategory: debouncedCond.requestCategory,
              searchContent: debouncedCond.searchContent,
              instructorId: debouncedCond.instructorId,
              isEnrolled: debouncedCond.isEnrolled,
              page: pageable.page,
              size: pageable.size,
              sort: pageable.sort,
            },
          },
        );

        console.log(res);
        const pageData = res.data.data;

        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setList((prev) =>
          reset ? pageData.content : [...prev, ...pageData.content],
        );
      } catch (e) {
        console.log(e);
        if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "강좌 목록 조회에 실패했습니다.",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [debouncedCond, pageable.page, pageable.size, pageable.sort, requireAuth],
  );

  useEffect(() => {
    setPageable((p) => ({ ...p, page: 0 }));
  }, [
    debouncedCond.requestCategory,
    debouncedCond.searchContent,
    debouncedCond.instructorId,
    debouncedCond.isEnrolled,
    pageable.size,
    JSON.stringify(pageable.sort),
  ]);

  useEffect(() => {
    fetchPage(pageable.page === 0);
  }, [pageable.page, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasNext) return;
    setPageable((p) => ({ ...p, page: p.page + 1 }));
  }, [loading, hasNext]);

  const updateCondition = useCallback((patch: Partial<CourseCardCondition>) => {
    setCondition((c) => ({ ...c, ...patch }));
  }, []);

  const setSort = useCallback((nextSort: string[]) => {
    setPageable((p) => ({ ...p, sort: nextSort, page: 0 }));
  }, []);

  const setSize = useCallback((nextSize: number) => {
    setPageable((p) => ({ ...p, size: nextSize, page: 0 }));
  }, []);

  const refresh = useCallback(() => {
    fetchPage(pageable.page === 0);
  }, [fetchPage, pageable.page]);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return {
    list,
    totalPages,
    totalElements,
    hasNext,
    loading,
    error,
    condition,
    pageable,
    setCondition: updateCondition,
    setSort,
    setSize,
    loadMore,
    refresh,
    setSearch: (text: string) => updateCondition({ searchContent: text }),
    setCategory: (cat: RequestCategory) =>
      updateCondition({ requestCategory: cat }),
  };
}

function useDebouncedCondition(
  cond: CourseCardCondition,
  delay: number,
): CourseCardCondition {
  const [debounced, setDebounced] = useState(cond);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced((prev) => ({
        ...cond,
        searchContent: cond.searchContent,
      }));
    }, delay);
    return () => clearTimeout(timer);
  }, [cond.searchContent, delay]);

  useEffect(() => {
    setDebounced((prev) => ({
      ...prev,
      requestCategory: cond.requestCategory,
      instructorId: cond.instructorId,
      isEnrolled: cond.isEnrolled,
    }));
  }, [cond.requestCategory, cond.instructorId, cond.isEnrolled]);

  return debounced;
}

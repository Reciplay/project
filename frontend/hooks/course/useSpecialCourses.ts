"use client";

import { getErrorMessage } from "@/lib/axios/error";
import type { CourseCard } from "@/types/course";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuery,
  CourseCardCondition,
  fetchCards,
  Pageable,
} from "./useCommonUtils";

export function useSpecialCourses(options?: {
  size?: number;
  sort?: string[];
}) {
  const size = options?.size ?? 5;
  const sort = options?.sort;
  const [list, setList] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);

  const cond: CourseCardCondition = useMemo(
    () => ({ requestCategory: "special" }),
    [],
  );
  const pageable: Pageable = useMemo(
    () => ({ page, size, sort }),
    [page, size, sort],
  );

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setMessage(null);
      const params = buildQuery(cond, pageable);
      const res = await fetchCards(params, false, controllerRef.current.signal);
      if (res.status === 200) {
        const d = res.data.data;
        setList(d.content ?? []);
        setTotalPages(d.totalPages ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        setMessage(res.data?.message ?? "목록을 불러오지 못했어요.");
      }
    } catch (e) {
      setMessage(getErrorMessage(e, "네트워크 오류가 발생했습니다."));
    } finally {
      setLoading(false);
    }
  }, [cond, pageable]);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  const refetch = useCallback(async () => {
    setPage(0);
    await load();
  }, [load]);

  return {
    list,
    loading,
    message,
    totalPages,
    totalElements,
    page,
    setPage,
    refetch,
  };
}

// hooks/course/enrolled/useEnrolledCourses.ts
"use client";

import restClient from "@/lib/axios/restClient";
import type { PaginationResponse } from "@/types/apiResponse";
import type { CourseCard } from "@/types/course";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuery,
  CourseCardCondition,
  ENDPOINT,
  Pageable,
  serialize,
} from "./useCommonUtils";

async function fetchCards(
  params: Record<string, unknown>,
  authed: boolean,
  signal?: AbortSignal
) {
  return restClient.get<PaginationResponse<CourseCard>>(ENDPOINT, {
    params,
    paramsSerializer: (p) => serialize(p as Record<string, unknown>),
    requireAuth: authed,
    signal,
  });
}

export function useEnrolledCourses(options?: {
  size?: number;
  sort?: string[];
}) {
  const size = options?.size ?? 10; // 10개만 호출
  const sort = options?.sort;

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [list, setList] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);

  const cond: CourseCardCondition = useMemo(
    () => ({ requestCategory: "enrolled" }),
    []
  );
  const pageable: Pageable = useMemo(
    () => ({ page, size, sort }),
    [page, size, sort]
  );

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    if (!isAuthenticated) {
      setList([]);
      setTotalPages(1);
      setTotalElements(0);
      setMessage(null);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const params = buildQuery(cond, pageable);
      const res = await fetchCards(params, true, controllerRef.current.signal);

      if (res.status === 200) {
        const d = res.data.data;
        setList(d.content ?? []);
        setTotalPages(d.totalPages ?? 1);
        setTotalElements(d.totalElements ?? 0);
      } else {
        console.log("목록을 불러오지 못했어요");
        setMessage(res.data?.message ?? "목록을 불러오지 못했어요.");
      }
    } catch (e) {
      console.log(e);
      if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
      setMessage(e?.response?.data?.message ?? "네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [cond, pageable, isAuthenticated]);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load, isAuthenticated]);

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
    isAuthenticated,
  };
}

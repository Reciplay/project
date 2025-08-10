// hooks/course/useMainCourses.ts
"use client";

import restClient from "@/lib/axios/restClient";
import type { PaginationResponse } from "@/types/apiResponse";
import type { CourseCard } from "@/types/course";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CourseCardCondition = {
  requestCategory?: string;
  searchContent?: string;
  instructorId?: number;
  isEnrolled?: boolean;
};

type SectionState = {
  list: CourseCard[];
  totalPages: number;
  totalElements: number;
  loading: boolean;
  message: string | null;
  refetch: () => Promise<void>;
};

type UseMainCoursesOptions = {
  page?: number; // 1-base
  size?: number;
  isAuthenticated?: boolean;
  specialCond?: CourseCardCondition;
  soonCond?: CourseCardCondition;
  enrolledCond?: CourseCardCondition;
};

const DEFAULT_SPECIAL: Readonly<CourseCardCondition> = Object.freeze({
  requestCategory: "special",
});
const DEFAULT_SOON: Readonly<CourseCardCondition> = Object.freeze({
  requestCategory: "soon",
});
const DEFAULT_ENROLLED: Readonly<CourseCardCondition> = Object.freeze({
  requestCategory: "enrolled",
});

export function useMainCourses(opts: UseMainCoursesOptions = {}) {
  const {
    page = 1,
    size = 12,
    isAuthenticated = false,
    specialCond,
    soonCond,
    enrolledCond,
  } = opts;

  // ✅ props로 넘어온 조건과 기본값 merge & 참조 안정화
  const mergedSpecial = useMemo(
    () => ({ ...DEFAULT_SPECIAL, ...(specialCond ?? {}) }),
    [specialCond]
  );
  const mergedSoon = useMemo(
    () => ({ ...DEFAULT_SOON, ...(soonCond ?? {}) }),
    [soonCond]
  );
  const mergedEnrolled = useMemo(
    () => ({ ...DEFAULT_ENROLLED, ...(enrolledCond ?? {}) }),
    [enrolledCond]
  );

  const makeSection = (): Omit<SectionState, "refetch"> => ({
    list: [],
    totalPages: 1,
    totalElements: 0,
    loading: false,
    message: null,
  });

  const [special, setSpecial] = useState(makeSection);
  const [soon, setSoon] = useState(makeSection);
  const [enrolled, setEnrolled] = useState(makeSection);

  // ✅ 섹션별 AbortController 분리
  const acSpecial = useRef<AbortController | null>(null);
  const acSoon = useRef<AbortController | null>(null);
  const acEnrolled = useRef<AbortController | null>(null);

  const fetchCards = useCallback(
    async (
      cond: CourseCardCondition,
      authed: boolean,
      signal?: AbortSignal
    ) => {
      // 서버가 flat 파라미터를 받는 형태
      return restClient.get<PaginationResponse<CourseCard>>(
        "/course/courses/cards",
        {
          params: {
            page: Math.max(0, page - 1), // 0-base 가정
            size,
            ...cond,
          },
          requireAuth: authed,
          signal,
        }
      );

      /* 서버가 nested만 받는다면:
      return restClient.get<PaginationResponse<CourseCard>>(
        "/course/courses/cards",
        {
          params: {
            courseCardCondition: { ...cond },
            pageable: { page: Math.max(0, page - 1), size },
          },
          requireAuth: authed,
          signal,
        }
      );
      */
    },
    [page, size]
  );

  const loadSpecial = useCallback(async () => {
    acSpecial.current?.abort();
    acSpecial.current = new AbortController();

    try {
      setSpecial((s) => ({ ...s, loading: true, message: null }));
      const res = await fetchCards(
        mergedSpecial,
        false,
        acSpecial.current.signal
      );
      if (res.status === 200) {
        const d = res.data.data;
        setSpecial({
          list: d.content,
          totalPages: d.totalPages,
          totalElements: d.totalElements,
          loading: false,
          message: null,
        });
      } else {
        setSpecial((s) => ({
          ...s,
          loading: false,
          message: res.data?.message ?? "특별 강좌를 불러오지 못했어요.",
        }));
      }
    } catch (e) {
      if (e?.name === "CanceledError") return;
      setSpecial((s) => ({
        ...s,
        loading: false,
        message: "네트워크 오류가 발생했습니다.",
      }));
    }
  }, [fetchCards, mergedSpecial]);

  const loadSoon = useCallback(async () => {
    acSoon.current?.abort();
    acSoon.current = new AbortController();

    try {
      setSoon((s) => ({ ...s, loading: true, message: null }));
      const res = await fetchCards(mergedSoon, false, acSoon.current.signal);
      if (res.status === 200) {
        const d = res.data.data;
        setSoon({
          list: d.content,
          totalPages: d.totalPages,
          totalElements: d.totalElements,
          loading: false,
          message: null,
        });
      } else {
        setSoon((s) => ({
          ...s,
          loading: false,
          message: res.data?.message ?? "오픈 예정 강좌를 불러오지 못했어요.",
        }));
      }
    } catch (e) {
      if (e?.name === "CanceledError") return;
      setSoon((s) => ({
        ...s,
        loading: false,
        message: "네트워크 오류가 발생했습니다.",
      }));
    }
  }, [fetchCards, mergedSoon]);

  const loadEnrolled = useCallback(async () => {
    acEnrolled.current?.abort();
    acEnrolled.current = new AbortController();

    if (!isAuthenticated) {
      setEnrolled((s) => ({
        ...s,
        list: [],
        totalElements: 0,
        totalPages: 1,
        loading: false,
        message: null,
      }));
      return;
    }

    try {
      setEnrolled((s) => ({ ...s, loading: true, message: null }));
      const res = await fetchCards(
        mergedEnrolled,
        true,
        acEnrolled.current.signal
      );
      if (res.status === 200) {
        const d = res.data.data;
        setEnrolled({
          list: d.content,
          totalPages: d.totalPages,
          totalElements: d.totalElements,
          loading: false,
          message: null,
        });
      } else {
        setEnrolled((s) => ({
          ...s,
          loading: false,
          message: res.data?.message ?? "내 수강중 강좌를 불러오지 못했어요.",
        }));
      }
    } catch (e) {
      if (e?.name === "CanceledError") return;
      setEnrolled((s) => ({
        ...s,
        loading: false,
        message: "네트워크 오류가 발생했습니다.",
      }));
    }
  }, [fetchCards, mergedEnrolled, isAuthenticated]);

  useEffect(() => {
    loadSpecial();
    loadSoon();
    loadEnrolled();
    return () => {
      acSpecial.current?.abort();
      acSoon.current?.abort();
      acEnrolled.current?.abort();
    };
  }, [loadSpecial, loadSoon, loadEnrolled]);

  const specialRefetch = useCallback(async () => {
    await loadSpecial();
  }, [loadSpecial]);
  const soonRefetch = useCallback(async () => {
    await loadSoon();
  }, [loadSoon]);
  const enrolledRefetch = useCallback(async () => {
    await loadEnrolled();
  }, [loadEnrolled]);

  const specialCourses: SectionState = { ...special, refetch: specialRefetch };
  const soonCourses: SectionState = { ...soon, refetch: soonRefetch };
  const enrolledCourses: SectionState = {
    ...enrolled,
    refetch: enrolledRefetch,
  };

  return { specialCourses, soonCourses, enrolledCourses };
}

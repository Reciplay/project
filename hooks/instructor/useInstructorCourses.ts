"use client";

import { sampleCourseCards } from "@/config/sampleCourse";
import restClient from "@/lib/axios/restClient";
import { PaginationResponse } from "@/types/apiResponse";
import { CourseCard } from "@/types/course";
import { useCallback, useEffect, useState } from "react";

interface Options {
  initialPage?: number;
  pageSize?: number;
  // 필요한 필터가 늘면 여기에 추가 (e.g., courseStatus, isEnrollment 등)
  courseStatus?: string;
  isEnrollment?: boolean;
}

export function useInstructorCourses(
  instructorId?: string,
  {
    initialPage = 1,
    pageSize = 12,
    courseStatus = "string",
    isEnrollment = true,
  }: Options = {}
) {
  const [page, setPage] = useState(initialPage);
  const [size] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [list, setList] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (p: number) => {
      if (!instructorId) {
        setErr("유효하지 않은 강사 ID입니다.");
        return;
      }
      try {
        setLoading(true);
        setErr(null);

        const res = await restClient.get<PaginationResponse<CourseCard>>(
          "/course/instructor/courses",
          {
            params: {
              requestCategory: "instructor",
              instructorId,
              page: p, // 서버 1-base 기준
              size,
              courseStatus,
              isEnrollment,
            },
            requireAuth: true,
          }
        );

        const data = res.data.data;
        setList(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch {
        // 필요시 에러 메시지 노출
        // setErr("강좌를 불러오는 중 오류가 발생했습니다.");
        // 데모/폴백
        setList(sampleCourseCards);
        setTotalPages(1);
        setTotalElements(sampleCourseCards.length);
      } finally {
        setLoading(false);
      }
    },
    [instructorId, size, courseStatus, isEnrollment]
  );

  useEffect(() => {
    // instructorId가 바뀌면 첫 페이지로
    setPage(initialPage);
  }, [instructorId, initialPage]);

  useEffect(() => {
    if (instructorId) fetchPage(page);
  }, [page, instructorId, fetchPage]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // 간단한 번호 페이지네이션 (최대 7개 버튼)
  const buildPages = () => {
    const maxBtns = 7;
    if (totalPages <= maxBtns)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    if (adjustedStart > 1) {
      pages.push(1);
      if (adjustedStart > 2) pages.push(-1);
    }

    for (let i = adjustedStart; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-2);
      pages.push(totalPages);
    }
    return pages;
  };

  return {
    // data
    list,
    page,
    size,
    totalPages,
    totalElements,

    // states
    loading,
    err,

    // actions
    setPage,
    onPrev,
    onNext,
    buildPages,
    refetch: () => fetchPage(page),
  };
}

// app/admin/hooks/useCourseList.ts
import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { Course, CourseSummary } from "@/types/course";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useCourseAdmin() {
  const [approvedList, setApprovedList] = useState<CourseSummary[]>([]);
  const [registerList, setRegisterList] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Course | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [instructorId, setInstructorId] = useState<number | null>(null);

  // ✅ 목록 조회
  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [approvedRes, registerRes] = await Promise.all([
        restClient.get<ApiResponse<CourseSummary[]>>(
          "/admin/course/summaries",
          { params: { isApprove: true }, requireAuth: true },
        ),
        restClient.get<ApiResponse<CourseSummary[]>>(
          "/admin/course/summaries",
          { params: { isApprove: false }, requireAuth: true },
        ),
      ]);

      setApprovedList(approvedRes.data.data ?? []);
      setRegisterList(registerRes.data.data ?? []);
    } catch (e) {
      setError(getErrorMessage(e, "강좌 목록 조회 실패"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  // ✅ 정렬
  const sortedApproved = useMemo(
    () =>
      [...approvedList].sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),
      ),
    [approvedList],
  );

  const sortedRegister = useMemo(
    () =>
      [...registerList].sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),
      ),
    [registerList],
  );

  // ✅ 상세 모달
  const openModal = useCallback(async (courseId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await restClient.get<ApiResponse<Course>>("/admin/course", {
        params: { courseId },
        requireAuth: true,
      });

      console.log(res.data.data.instructorId);
      setInstructorId(res.data.data.instructorId);
      setDetail(res.data.data);
    } catch (e) {
      console.log(e);
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDetail(null);
  }, []);

  // ✅ 승인/반려 처리
  // courseId 필요함
  const handleApprove = useCallback(
    async (courseId: number, message: string, isApprove: boolean) => {
      try {
        const res = await restClient.put(
          "/admin/course",
          { instructorId, courseId, message, isApprove },
          { requireAuth: true },
        );
        await fetchLists();
        setModalOpen(false);
      } catch (e) {
        console.log(e);
        alert("강좌 승인 처리에 실패했습니다.");
      }
    },
    [fetchLists, instructorId],
  );

  return {
    loading,
    error,
    sortedApproved,
    sortedRegister,
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,
    handleApprove,
  };
}

// hooks/admin/useInstructorAdmin.ts
"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { InstructorDetail, InstructorSummary } from "@/types/instructor";
import { useCallback, useEffect, useMemo, useState } from "react";

export const sampleInstructorSummaries: InstructorSummary[] = [
  {
    instructorId: 1,
    name: "김철수",
    email: "chulsoo@example.com",
    registeredAt: "2025-08-10T09:15:00Z",
  },
  {
    instructorId: 2,
    name: "이영희",
    email: "younghee@example.com",
    registeredAt: "2025-08-08T14:30:00Z",
  },
  {
    instructorId: 3,
    name: "박민수",
    email: "minsoo@example.com",
    registeredAt: "2025-08-05T07:45:00Z",
  },
];

export const sampleInstructorDetail: InstructorDetail = {
  instructorId: 1,
  name: "김철수",
  email: "chulsoo@example.com",
  registeredAt: "2025-08-10T09:15:00Z",
  nickName: "코딩마스터",
  birthDate: "1990-04-15",
  createdAt: "2025-08-10T09:15:00Z",
  introduction: "안녕하세요. 10년 경력의 풀스택 개발자 김철수입니다.",
  address: "서울특별시 강남구 테헤란로 123",
  phoneNumber: "010-1234-5678",
  licenses: [
    {
      name: "정보처리기사",
      institution: "한국산업인력공단",
      acquisitionDate: "2015-06-20",
      grade: "합격",
    },
    {
      name: "SQL 개발자(SQLD)",
      institution: "한국데이터산업진흥원",
      acquisitionDate: "2018-04-10",
      grade: "합격",
    },
  ],
  careers: [
    {
      companyName: "네이버",
      position: "Frontend 개발자",
      jobDescription: "웹 서비스 UI/UX 개발 및 성능 최적화",
      startDate: "2016-03-01",
      endDate: "2020-12-31",
    },
    {
      companyName: "카카오",
      position: "Fullstack 개발자",
      jobDescription: "백엔드 API 개발 및 프론트엔드 통합",
      startDate: "2021-01-01",
      endDate: "2025-07-31",
    },
  ],
};
export default function useInstructorAdmin() {
  const [approvedList, setApprovedList] = useState<InstructorSummary[]>([]);
  const [registerList, setRegisterList] = useState<InstructorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<InstructorDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ✅ 목록 조회
  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [approvedRes, registerRes] = await Promise.all([
        restClient.get<ApiResponse<InstructorSummary[]>>(
          "/course/admin/instructor/summaries",
          { params: { isApprove: true }, requireAuth: true }
        ),
        restClient.get<ApiResponse<InstructorSummary[]>>(
          "/course/admin/instructor/summaries",
          { params: { isApprove: false }, requireAuth: true }
        ),
      ]);

      setApprovedList(approvedRes.data.data ?? []);
      setRegisterList(registerRes.data.data ?? []);
    } catch (e) {
      setError(e?.message ?? "목록 조회 실패");
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
          new Date(a.registeredAt).getTime()
      ),
    [approvedList]
  );

  const sortedRegister = useMemo(
    () =>
      [...registerList].sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime()
      ),
    [registerList]
  );

  // ✅ 상세 모달
  const openModal = useCallback(async (instructorId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      console.log(instructorId);
      const res = await restClient.get<ApiResponse<InstructorDetail>>(
        "/course/admin/instructor",
        { params: { instructorId }, requireAuth: true }
      );

      console.log(res.data.data);
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
  // !TODO 테스트 해야함, instructorID 필요
  const handleApprove = useCallback(
    async (instructorId: number, message: string, isApprove: boolean) => {
      try {
        const res = await restClient.put<ApiResponse<object>>(
          "/course/admin/instructor",
          {
            instructorId,
            message,
            isApprove,
          },
          { requireAuth: true }
        );

        console.log("승인 처리 결과:", res.status);
        console.log(res);
        await fetchLists(); // 처리 후 목록 갱신
        setModalOpen(false);
      } catch (e) {
        console.log(e);
        alert("승인 처리에 실패했습니다.");
      }
    },
    [fetchLists]
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

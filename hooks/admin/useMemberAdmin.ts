import { UserDetail, UserSummary } from "@/types/user";

export const sampleMembers: UserSummary[] = [
  {
    userId: 1,
    name: "홍길동",
    email: "gildong@example.com",
    createdAt: "2025-06-30T08:15:00Z",
  },
  {
    userId: 2,
    name: "김철수",
    email: "chulsoo.kim@example.com",
    createdAt: "2025-07-02T12:30:45Z",
  },
  {
    userId: 3,
    name: "이영희",
    email: "younghee.lee@example.com",
    createdAt: "2025-07-05T17:50:10Z",
  },
  {
    userId: 4,
    name: "박민수",
    email: "minsu.park@example.com",
    createdAt: "2025-07-08T09:05:20Z",
  },
  {
    userId: 5,
    name: "최수진",
    email: "sujin.choi@example.com",
    createdAt: "2025-07-10T14:22:33Z",
  },
];

export const sampleMemberDetail: UserDetail = {
  userId: 2,
  name: "김철수",
  email: "chulsoo.kim@example.com",
  createdAt: "2025-07-02T12:30:45Z",
  role: false,
  job: "개발자",
  nickname: "철수짱",
  birthDate: "1990-03-15",
};

// hooks/admin/useMembers.ts

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useMemberAdmin() {
  const [list, setList] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 상세 모달 관련
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await restClient.get<ApiResponse<UserSummary[]>>(
        "/course/admin/user/summaries",
        { requireAuth: true },
      );
      setList(res.data.data ?? []);
    } catch (e) {
      setError(e?.message ?? "회원 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /** 최신 가입일 순 정렬 */
  const sorted = useMemo(
    () =>
      [...list].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [list],
  );

  /** 상세 모달 열기 */
  const openModal = useCallback(async (userId: number) => {
    setModalOpen(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await restClient.get<ApiResponse<UserDetail>>(
        "/course/admin/user",
        { params: { userId }, requireAuth: true },
      );
      setDetail(res.data.data ?? null);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  /** 상세 모달 닫기 */
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDetail(null);
  }, []);

  /** 회원 탈퇴 */
  const deleteMember = useCallback(
    async (userId: number) => {
      try {
        await restClient.delete<ApiResponse<object>>("/course/admin/user", {
          params: { userId },
          requireAuth: true,
        });
        await fetchList(); // 탈퇴 후 목록 갱신
        setModalOpen(false);
      } catch {
        alert("회원 탈퇴 처리에 실패했습니다.");
      }
    },
    [fetchList],
  );

  return {
    // 목록
    list,
    sorted,
    loading,
    error,
    refetch: fetchList,

    // 상세/모달
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,

    // 액션
    deleteMember,
  };
}

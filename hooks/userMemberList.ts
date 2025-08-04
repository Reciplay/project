// app/admin/hooks/useMemberList.ts
import { useState, useEffect } from "react";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
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

export default function useMemberList() {
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restClient.get<ApiResponse<UserSummary[]>>(
          "/api/v1/course/admin/user/summaries"
        );
        setMembers(res.data.data);
      } catch {
        setMembers(sampleMembers);
        // setError("서버 연결에 실패했습니다. (샘플 데이터 표시 중)");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openModal = async (userId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await restClient.get<ApiResponse<UserDetail>>(
        "/api/v1/course/admin/user",
        { params: { userId } }
      );
      setSelected(res.data.data);
    } catch {
      setSelected(sampleMemberDetail);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return {
    members,
    loading,
    error,
    modalOpen,
    selected,
    detailLoading,
    openModal,
    closeModal,
  };
}

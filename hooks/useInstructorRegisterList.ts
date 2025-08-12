// app/admin/hooks/useInstructorRegisterList.ts
import { useEffect, useState } from "react";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { InstructorDetail, InstructorSummary } from "@/types/instructor";

// 샘플 데이터
const sampleInstructors: InstructorSummary[] = [
  {
    instructorId: 1,
    name: "홍길동",
    email: "gildong@example.com",
    registeredAt: "2025-07-01T09:15:30Z",
  },
  {
    instructorId: 2,
    name: "김철수",
    email: "chulsoo.kim@example.com",
    registeredAt: "2025-07-03T14:22:10Z",
  },
  {
    instructorId: 3,
    name: "이영희",
    email: "younghee.lee@example.com",
    registeredAt: "2025-07-05T18:45:00Z",
  },
  {
    instructorId: 4,
    name: "박민수",
    email: "minsu.park@example.com",
    registeredAt: "2025-07-07T11:30:55Z",
  },
  {
    instructorId: 5,
    name: "최수진",
    email: "sujin.choi@example.com",
    registeredAt: "2025-07-08T16:05:20Z",
  },
];

const sampleInstructorDetail: InstructorDetail = {
  instructorId: 101,
  name: "김요리",
  email: "chef.kim@example.com",
  registeredAt: "2025-08-04T07:23:23.212Z",
  nickName: "요리왕김",
  birthDate: "1990-04-17",
  createdAt: "2025-08-04T07:23:23.212Z",
  introduction:
    "15년 경력의 한식, 양식 전문 셰프입니다. 다양한 레스토랑 및 강의 경험이 있습니다.",
  address: "서울시 강남구 테헤란로 123",
  phoneNumber: "010-1234-5678",
  licenses: [
    {
      name: "한식조리사",
      institution: "한국조리협회",
      acquisitionDate: "2012-07-10",
      grade: "1급",
    },
    {
      name: "양식조리사",
      institution: "서울요리학원",
      acquisitionDate: "2015-03-22",
      grade: "2급",
    },
  ],
  careers: [
    {
      companyName: "더파이브키친",
      position: "수석 셰프",
      jobDescription: "한식/양식 메뉴 개발 및 조리 총괄",
      startDate: "2015-04-01",
      endDate: "2020-02-28",
    },
    {
      companyName: "쉐프마스터 아카데미",
      position: "요리 강사",
      jobDescription: "성인 대상 양식/한식 강의",
      startDate: "2020-03-01",
      endDate: "2025-08-01",
    },
  ],
};

export default function useInstructorRegisterList() {
  const [instructors, setInstructors] = useState<InstructorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<InstructorDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await restClient.get<ApiResponse<InstructorSummary[]>>(
          "/api/v1/course/admin/instructor/summaries"
        );
        setInstructors(res.data.data);
      } catch (err) {
        setInstructors(sampleInstructors);
        // setError("서버 연결에 실패했습니다. (샘플 데이터 표시 중)");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const sorted = [...instructors].sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );

  const openModal = async (instructorId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await restClient.get<ApiResponse<InstructorDetail>>(
        "/api/v1/course/admin/instructor",
        {
          params: { instructorId },
        }
      );
      setDetail(res.data.data);
    } catch (err) {
      setDetail(sampleInstructorDetail);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetail(null);
  };

  const handleApprove = async (
    instructorId: number,
    message: string,
    isApprove: boolean
  ) => {
    try {
      await restClient.put("/api/v1/course/admin/instructor/approve", {
        message: { message },
        isApprove: { isApprove },
        instructorId,
      });
      // 승인 후 UI 업데이트 등
    } catch (error) {
      alert("승인 처리에 실패했습니다.");
    }
  };

  return {
    sorted,
    loading,
    error,
    modalOpen,
    detail,
    detailLoading,
    openModal,
    closeModal,
    handleApprove,
  };
}

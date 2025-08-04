// app/admin/InstructorRegisterList.tsx
"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useEffect, useState } from "react";
import styles from "./instructorRegisterList.module.scss";
import IconWithText from "@/components/text/iconWithText";
import Image from "next/image";
import ImageWrapper from "@/components/image/imageWrapper";
import Introduction from "../../instructor/register/__components/introduction";
import Certificate from "../../instructor/register/__components/certificate";
import Career from "../../instructor/register/__components/career";
import BaseButton from "@/components/button/baseButton";

interface InstructorSummary {
  instructorId: number;
  name: string;
  email: string;
  registeredAt: string;
}

interface InstructorDetail {
  instructorId: number;
  name: string;
  email: string;
  registeredAt: string;
  // 원하는 추가 필드가 있으면 여기에 선언
  bio?: string;
}

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
  instructorId: 2,
  name: "김철수",
  email: "chulsoo.kim@example.com",
  registeredAt: "2025-07-03T14:22:10Z",
  bio: "프론트엔드 개발자 출신, 5년 경력 보유",
};

export default function InstructorRegisterList() {
  const [instructors, setInstructors] = useState<InstructorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<InstructorDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await restClient.get<ApiResponse<InstructorSummary[]>>(
          "/api/v1/course/admin/instructor/summaries"
        );
        setInstructors(res.data.data);
      } catch (err) {
        console.error(err);
        // 에러 시 샘플로 대체
        setInstructors(sampleInstructors);
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
    setDetailError(null);
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
      console.error(err);
      // 에러 시 샘플 상세로 대체
      setDetail(sampleInstructorDetail);
      // 혹은 setDetailError("상세 정보 불러오기 실패");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetail(null);
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.sectionTitle}>강사 신청 목록</div>

        {loading || error ? (
          <div className={styles.sectionBox}>
            {loading && (
              <div className={`${styles.input} loading`}>로딩 중…</div>
            )}
            {error && <div className={`${styles.input} error`}>{error}</div>}
          </div>
        ) : (
          <div className={styles.sectionBox}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>등록일</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((inst) => (
                    <tr
                      key={inst.instructorId}
                      onClick={() => openModal(inst.instructorId)}
                    >
                      <td>
                        {new Date(inst.registeredAt).toLocaleDateString()}
                      </td>
                      <td>{inst.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {detail && (
              <div className={styles.modalContent}>
                <div className={styles.frame}>
                  <div className={styles.textContainer}>
                    <span className={styles.name}>{detail.name}</span>
                    <span>여 2000 (25세)</span>
                    <div className={styles.innerText}>
                      <IconWithText iconName="email" title={detail.email} />
                      <IconWithText iconName="user2" title="양식 강사" />
                    </div>
                    <IconWithText
                      iconName="address"
                      title="부산 강서구 명지국제6로 107 부산명지 대방디엠시티 센텀오션 2차"
                    />
                  </div>
                  <div className={styles.imageWrapper}>
                    <Image
                      src="/images/profile2.jpg"
                      fill
                      alt="profile"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className={styles.infoContainer}>
                  <Introduction />
                  <Certificate />
                  <Career />
                </div>
                <div className={styles.actions}>
                  <BaseButton
                    title="강사 등록"
                    className={styles.btnRegister}
                  />

                  <BaseButton title="반려" className={styles.btnRegister} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

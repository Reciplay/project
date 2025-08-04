// app/admin/MemberList.tsx
"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useEffect, useState } from "react";
import styles from "./memberList.module.scss";

export interface MemberSummary {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface MemberDetail {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
  role: boolean;
  job: string;
  nickname: string;
  birthDate: string;
}

export const sampleMembers: MemberSummary[] = [
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

export const sampleMemberDetail: MemberDetail = {
  userId: 2,
  name: "김철수",
  email: "chulsoo.kim@example.com",
  createdAt: "2025-07-02T12:30:45Z",
  role: false,
  job: "개발자",
  nickname: "철수짱",
  birthDate: "1990-03-15",
};

export default function MemberList() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await restClient.get<ApiResponse<MemberSummary[]>>(
          "/api/v1/course/admin/user/summaries"
        );
        setMembers(res.data.data);
      } catch {
        setMembers(sampleMembers);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = [...members].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const openModal = async (userId: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await restClient.get<ApiResponse<MemberDetail>>(
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

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.sectionTitle}>회원 목록</div>
        <div className={styles.tableWrapper}>
          {loading || error ? (
            <div className={styles.input}>{loading ? "로딩 중…" : error}</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>가입일</th>
                  <th>이름</th>
                  <th>이메일</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr key={m.userId} onClick={() => openModal(m.userId)}>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <p>불러오는 중…</p>
            ) : selected ? (
              <div className={styles.modalContent}>
                <h3>회원 상세 정보</h3>
                <ul className={styles.detailList}>
                  <li>
                    <strong>아이디:</strong> {selected.userId}
                  </li>
                  <li>
                    <strong>이름:</strong> {selected.name}
                  </li>
                  <li>
                    <strong>닉네임:</strong> {selected.nickname}
                  </li>
                  <li>
                    <strong>이메일:</strong> {selected.email}
                  </li>
                  <li>
                    <strong>직업:</strong> {selected.job}
                  </li>
                  <li>
                    <strong>생년월일:</strong> {selected.birthDate}
                  </li>
                  <li>
                    <strong>가입일:</strong>{" "}
                    {new Date(selected.createdAt).toLocaleString()}
                  </li>
                  <li>
                    <strong>역할:</strong>{" "}
                    {selected.role ? "관리자" : "일반 회원"}
                  </li>
                </ul>
                <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles.btnClose}`}
                    onClick={closeModal}
                  >
                    닫기
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

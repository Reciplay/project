"use client";

import CustomCard from "@/components/card/customCard";
import CustomGrid from "@/components/grid/customGrid/customGrid";
import { useInstructorCourses } from "@/hooks/instructor/useInstructorCourses";
import { CARDTYPE } from "@/types/card";
import { useParams, useRouter } from "next/navigation";
import styles from "./courses.module.scss";

interface CoursesProps {
  initialPage?: number;
  pageSize?: number;
}

export default function Courses({
  initialPage = 0,
  pageSize = 12,
}: CoursesProps) {
  const { instructorId } = useParams<{ instructorId: string }>();
  const router = useRouter();

  const {
    list,
    page,
    totalPages,
    loading,
    err,
    onPrev,
    onNext,
    setPage,
    buildPages,
  } = useInstructorCourses(instructorId, { initialPage, pageSize });

  return (
    <div className={styles.container}>
      <div className={styles.title}>강좌 목록 </div>

      {loading && <div className={styles.loading}>불러오는 중…</div>}
      {err && <div className={styles.error}>{err}</div>}

      {!loading && !err && (
        <>
          {list.length === 0 ? (
            <div className={styles.emptyMessage}>
              현재 진행중인 강좌가 없습니다.
            </div>
          ) : (
            <>
              <CustomGrid
                items={list}
                minItemWidth="15.709rem" // 251.34px
                gap="1.25rem" // 20px
                renderItem={(course) => (
                  <CustomCard
                    key={course.courseId}
                    data={course}
                    type={CARDTYPE.VERTICAL}
                    onClick={() => router.push(`/course/${course.courseId}`)}
                  />
                )}
              />
              {totalPages > 1 && (
                <nav className={styles.pagination}>
                  <button
                    onClick={onPrev}
                    disabled={page === 1}
                    className={styles.navBtn}
                  >
                    이전
                  </button>

                  <div className={styles.pageList}>
                    {buildPages().map((n, idx) =>
                      n === -1 || n === -2 ? (
                        <span key={`e-${idx}`} className={styles.ellipsis}>
                          …
                        </span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`${styles.pageBtn} ${
                            n === page ? styles.active : ""
                          }`}
                        >
                          {n}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={onNext}
                    disabled={page === totalPages}
                    className={styles.navBtn}
                  >
                    다음
                  </button>
                </nav>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

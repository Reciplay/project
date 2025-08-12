"use client";

import { sampleCourseDetail } from "@/config/sampleCourse";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { CourseDetail } from "@/types/course";
import { useEffect, useMemo, useState } from "react";

export function useCourseInfo(courseId?: string) {
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 로컬 상태(서버 동기화 전 UI용)
  const [isWished, setIsWished] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  // 중복 클릭 방지
  const [zzimPending, setZzimPending] = useState(false);
  const [enrollPending, setEnrollPending] = useState(false);

  const cid = useMemo(() => Number(courseId), [courseId]);

  /** ✅ 찜 토글 */
  const handleZzim = async () => {
    if (!cid || zzimPending) return;
    setZzimPending(true);

    try {
      if (!isWished) {
        // 찜 등록
        const res = await restClient.post<ApiResponse<object>>(
          "/user/zzim",
          null,
          {
            params: { courseId: cid },
            requireAuth: true,
            validateStatus: () => true,
          }
        );

        if (res.status >= 200 && res.status < 300) {
          setIsWished(true);
        } else {
          // 서버가 "중복 찜"을 에러로 주는 경우(409/400 등)
          setMessage(res.data?.message ?? "찜 등록에 실패했습니다.");
        }
      } else {
        // 찜 해제
        const res = await restClient.delete<ApiResponse<object>>("/user/zzim", {
          params: { courseId: cid },
          requireAuth: true,
          validateStatus: () => true,
        });

        if (res.status >= 200 && res.status < 300) {
          setIsWished(false);
        } else {
          setMessage(res.data?.message ?? "찜 해제에 실패했습니다.");
        }
      }
    } catch (e) {
      setMessage("네트워크 오류로 찜 처리에 실패했습니다.");
    } finally {
      setZzimPending(false);
    }
  };

  /** ✅ 수강 신청 토글 */
  const handleEnroll = async () => {
    if (!cid || enrollPending) return;
    setEnrollPending(true);

    try {
      if (!isEnrolled) {
        // 수강 신청
        const res = await restClient.post<ApiResponse<object>>(
          "/course/enrollment",
          null,
          {
            params: { courseId: cid },
            requireAuth: true,
            validateStatus: () => true,
          }
        );

        if (res.status >= 200 && res.status < 300) {
          setIsEnrolled(true);
        } else {
          setMessage(res.data?.message ?? "수강 신청에 실패했습니다.");
        }
      } else {
        // 수강 신청 취소
        const res = await restClient.delete<ApiResponse<object>>(
          "/course/enrollment",
          {
            params: { courseId: cid },
            requireAuth: true,
            validateStatus: () => true,
          }
        );

        if (res.status >= 200 && res.status < 300) {
          setIsEnrolled(false);
        } else {
          setMessage(res.data?.message ?? "수강 신청 취소에 실패했습니다.");
        }
      }
    } catch (e) {
      setMessage("네트워크 오류로 수강 신청 처리에 실패했습니다.");
    } finally {
      setEnrollPending(false);
    }
  };

  useEffect(() => {
    let alive = true;

    if (!cid) {
      setLoading(false);
      setMessage("유효하지 않은 강좌 ID입니다.");
      setCourseDetail(sampleCourseDetail);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await restClient.get<ApiResponse<CourseDetail>>(
          "/course/courses",
          {
            params: { courseId: cid },
            requireAuth: true,
            validateStatus: () => true,
          }
        );

        if (!alive) return;

        if (res.status === 400) {
          console.log(res);
          setMessage(res.data?.message ?? "잘못된 요청입니다.");
          setCourseDetail(sampleCourseDetail);
          return;
        }

        if (res.status === 404) {
          console.log(res);
          setMessage(res.data?.message ?? "해당 강좌를 찾을 수 없습니다.");
          setCourseDetail(sampleCourseDetail);
          return;
        }

        const data = res.data?.data ?? sampleCourseDetail;
        setCourseDetail(data);

        // 서버에서 상태 내려주면 여기에 매핑(키 이름 예시는 가정)
        // setIsWished(!!data.isWished);
        // setIsEnrolled(!!data.isEnrolled);
      } catch (e) {
        console.log(e);
        if (!alive) return;
        setCourseDetail(sampleCourseDetail);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      alive = false;
    };
  }, [cid]);

  return {
    courseDetail,
    loading,
    message,

    // actions
    handleZzim,
    handleEnroll,

    // local states (UI 연결용)
    isWished,
    isEnrolled,
    zzimPending,
    enrollPending,
  };
}

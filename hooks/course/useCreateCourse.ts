// hooks/course/useCreateCourse.ts
"use client";

import restClient from "@/lib/axios/restClient";
import { useCallback, useMemo, useState } from "react";

export type RequestCourseInfo = {
  courseId: number;
  title: string;
  enrollmentStartDate: string; // ISO 문자열
  enrollmentEndDate: string; // ISO 문자열
  categoryId: number;
  summary: string;
  maxEnrollments: number;
  description: string;
  level: number; // 0: 입문 등 백엔드 정의에 맞게 사용
  announcement: string;
  canLearns: string[];
};

type CreateCourseState = {
  requestCourseInfo: RequestCourseInfo;
  thumbnailImages: File[]; // 다중 파일
  courseCoverImage: File | null;
};

export function useCreateCourse() {
  const endpoint = "/course/courses";

  const [state, setState] = useState<CreateCourseState>({
    requestCourseInfo: {
      courseId: 0,
      title: "",
      enrollmentStartDate: "",
      enrollmentEndDate: "",
      categoryId: 0,
      summary: "",
      maxEnrollments: 0,
      description: "",
      level: 0,
      announcement: "",
      canLearns: [""], // 기본 1개 입력칸
    },
    thumbnailImages: [],
    courseCoverImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ---------- 입력 핸들러 (텍스트/숫자/날짜) ----------
  const setField = useCallback(
    <K extends keyof RequestCourseInfo>(
      key: K,
      value: RequestCourseInfo[K]
    ) => {
      setState((prev) => ({
        ...prev,
        requestCourseInfo: { ...prev.requestCourseInfo, [key]: value },
      }));
    },
    []
  );

  // 날짜를 Date → ISO로 저장하고 싶을 때
  const setDateISO = useCallback(
    (key: "enrollmentStartDate" | "enrollmentEndDate", date: Date | string) => {
      const iso =
        typeof date === "string"
          ? new Date(date).toISOString()
          : date.toISOString();
      setField(key, iso as RequestCourseInfo[typeof key]);
    },
    [setField]
  );

  // canLearns 배열 조작
  const addCanLearn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      requestCourseInfo: {
        ...prev.requestCourseInfo,
        canLearns: [...prev.requestCourseInfo.canLearns, ""],
      },
    }));
  }, []);

  const updateCanLearn = useCallback((index: number, value: string) => {
    setState((prev) => {
      const next = [...prev.requestCourseInfo.canLearns];
      next[index] = value;
      return {
        ...prev,
        requestCourseInfo: { ...prev.requestCourseInfo, canLearns: next },
      };
    });
  }, []);

  const removeCanLearn = useCallback((index: number) => {
    setState((prev) => {
      const next = prev.requestCourseInfo.canLearns.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        requestCourseInfo: {
          ...prev.requestCourseInfo,
          canLearns: next.length ? next : [""],
        },
      };
    });
  }, []);

  const setThumbnails = useCallback((files: File[]) => {
    setState((prev) => ({ ...prev, thumbnailImages: files }));
  }, []);

  const setCover = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, courseCoverImage: file }));
  }, []);

  // ---------- 파일 핸들러 ----------
  const setThumbnailsFromInput = useCallback((files: FileList | null) => {
    if (!files) return;
    setState((prev) => ({
      ...prev,
      thumbnailImages: [...prev.thumbnailImages, ...Array.from(files)],
    }));
  }, []);

  const removeThumbnail = useCallback((index: number) => {
    setState((prev) => {
      const next = prev.thumbnailImages.filter((_, i) => i !== index);
      return { ...prev, thumbnailImages: next };
    });
  }, []);

  const clearThumbnails = useCallback(() => {
    setState((prev) => ({ ...prev, thumbnailImages: [] }));
  }, []);

  const setCoverFromInput = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, courseCoverImage: file }));
  }, []);

  // ---------- 제출 ----------
  const submit = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // 유효성(간단 예시) — 필요에 따라 강화
      if (!state.requestCourseInfo.title.trim()) {
        throw new Error("강좌 제목을 입력해 주세요.");
      }
      if (
        !state.requestCourseInfo.enrollmentStartDate ||
        !state.requestCourseInfo.enrollmentEndDate
      ) {
        throw new Error("수강 신청 기간을 설정해 주세요.");
      }
      if (!state.courseCoverImage) {
        throw new Error("강좌 커버 이미지를 업로드해 주세요.");
      }

      const formData = new FormData();

      // JSON → Blob
      const jsonBlob = new Blob([JSON.stringify(state.requestCourseInfo)], {
        type: "application/json",
      });
      formData.append("requestCourseInfo", jsonBlob);

      // 썸네일 배열
      state.thumbnailImages.forEach((file) => {
        formData.append("thumbnailImages", file);
      });

      // 커버 이미지
      formData.append("courseCoverImage", state.courseCoverImage);

      const res = await restClient.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        requireAuth: true,
      });

      return res.data; // 필요 시 호출부에서 활용
    } catch (e) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "업로드 중 오류가 발생했습니다.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [endpoint, state]);

  const reset = useCallback(() => {
    setState({
      requestCourseInfo: {
        courseId: 0,
        title: "",
        enrollmentStartDate: "",
        enrollmentEndDate: "",
        categoryId: 0,
        summary: "",
        maxEnrollments: 0,
        description: "",
        level: 0,
        announcement: "",
        canLearns: [""],
      },
      thumbnailImages: [],
      courseCoverImage: null,
    });
    setError("");
  }, []);

  // 미리보기용 URL
  const thumbnailPreviews = useMemo(
    () => state.thumbnailImages.map((f) => URL.createObjectURL(f)),
    [state.thumbnailImages]
  );
  const coverPreview = useMemo(
    () =>
      state.courseCoverImage ? URL.createObjectURL(state.courseCoverImage) : "",
    [state.courseCoverImage]
  );

  return {
    // 상태
    requestCourseInfo: state.requestCourseInfo,
    thumbnailImages: state.thumbnailImages,
    courseCoverImage: state.courseCoverImage,

    // 파생 데이터
    thumbnailPreviews,
    coverPreview,

    // 플래그
    loading,
    error,

    // 입력/파일 핸들러
    setField,
    setDateISO,
    addCanLearn,
    updateCanLearn,
    removeCanLearn,
    setThumbnailsFromInput,
    removeThumbnail,
    clearThumbnails,
    setCoverFromInput,
    setThumbnails,
    setCover,
    // 전송/초기화
    submit,
    reset,
  };
}

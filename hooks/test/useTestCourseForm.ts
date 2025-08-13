"use client";

import { LectureDTO } from "@/types/lecture";
import { useCallback, useMemo, useState } from "react";

export type RequestCourseInfo = {
  courseId?: number;
  title: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  categoryId?: number;
  summary: string;
  maxEnrollments: number;
  description: string;
  level: number;
  announcement: string;
  canLearns: string[];
};

/** 화면 상태의 원본 이미지들 (아직 URL 아님) */
export type CourseImagesRaw = {
  thumbnails: (string | File)[]; // 여러 개: URL 문자열 또는 File
  cover: string | File | null; // 단일: URL 문자열 또는 File
};

export function useCourseForm() {
  /** 1) 기본 정보 */
  const [requestCourseInfo, setRequestCourseInfo] = useState<RequestCourseInfo>(
    {
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
      canLearns: [],
    },
  );

  /** 2) 이미지 상태 (URL|string 또는 File) */
  const [thumbnailImages, setThumbnailImages] = useState<(string | File)[]>([]);
  const [courseCoverImage, setCourseCoverImage] = useState<
    string | File | null
  >(null);

  /** 3) 강의 배열 */
  const [lectures, setLectures] = useState<LectureDTO[]>([]);

  /** 얕은 필드 업데이트 */
  const setCourseField = useCallback(
    <K extends keyof RequestCourseInfo>(
      key: K,
      value: RequestCourseInfo[K],
    ) => {
      setRequestCourseInfo((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /** 깊은 path 업데이트 (예: "requestCourseInfo.title") */
  const setByPath = useCallback((path: string, value: unknown) => {
    const keys = path.split(".");
    if (!keys.length) return;

    if (keys[0] === "requestCourseInfo") {
      setRequestCourseInfo((prev) => {
        const clone: Record<string, unknown> = { ...prev };
        let obj: Record<string, unknown> = clone;
        for (let i = 1; i < keys.length - 1; i++) {
          obj[keys[i]] = (obj[keys[i]] as Record<string, unknown>) ?? {};
          obj = obj[keys[i]] as Record<string, unknown>;
        }
        obj[keys[keys.length - 1]] = value;
        return clone as RequestCourseInfo;
      });
      return;
    }

    if (keys[0] === "thumbnailImages") {
      setThumbnailImages(value as (string | File)[]);
      return;
    }

    if (keys[0] === "courseCoverImage") {
      setCourseCoverImage(value as string | File | null);
      return;
    }
  }, []);

  /** 강의: 추가 */
  const addLecture = useCallback((initial?: Partial<LectureDTO>) => {
    setLectures((prev) => {
      const nextSeq = prev.length;
      const base: LectureDTO = {
        title: "",
        summary: "",
        sequence: nextSeq,
        materials: "", // 문자열만
        startedAt: "",
        endedAt: "",
        chapterList: [],
        localMaterialFile: null,
      };
      return [...prev, { ...base, ...initial, sequence: nextSeq }];
    });
  }, []);

  /** 강의: 수정(부분 업데이트) */
  const updateLecture = useCallback(
    (index: number, patch: Partial<LectureDTO>) => {
      setLectures((prev) =>
        prev.map((lec, i) => (i === index ? { ...lec, ...patch } : lec)),
      );
    },
    [],
  );

  /** 강의: 파일 세팅 (로컬 전용 필드만 갱신, 서버 JSON의 materials에는 파일명 같은 문자열을 넣고 싶으면 동시 업데이트 가능) */
  const setLectureFile = useCallback((index: number, file: File | null) => {
    setLectures((prev) =>
      prev.map((lec, i) =>
        i === index
          ? {
              ...lec,
              localMaterialFile: file,
              materials: file
                ? "name" in file
                  ? file.name
                  : lec.materials
                : lec.materials,
            }
          : lec,
      ),
    );
  }, []);

  /** 강의: 삭제(시퀀스 재정렬) */
  const removeLecture = useCallback((index: number) => {
    setLectures((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((lec, i) => ({ ...lec, sequence: i })),
    );
  }, []);

  /** 제출 시 넘길 데이터 조립자 */
  const getRequestCourseInfo = useCallback(
    () => requestCourseInfo,
    [requestCourseInfo],
  );
  const getImagesRaw = useCallback(
    (): CourseImagesRaw => ({
      thumbnails: thumbnailImages,
      cover: courseCoverImage,
    }),
    [thumbnailImages, courseCoverImage],
  );
  const getLectures = useCallback(() => lectures, [lectures]);

  /** 리셋 */
  const reset = useCallback(() => {
    setRequestCourseInfo({
      title: "",
      enrollmentStartDate: "",
      enrollmentEndDate: "",
      categoryId: undefined,
      summary: "",
      maxEnrollments: 0,
      description: "",
      level: 0,
      announcement: "",
      canLearns: [],
    });
    setThumbnailImages([]);
    setCourseCoverImage(null);
    setLectures([]);
  }, []);

  return useMemo(
    () => ({
      // state
      requestCourseInfo,
      thumbnailImages,
      courseCoverImage,
      lectures,

      // setters
      setCourseField,
      setByPath,
      setThumbnailImages,
      setCourseCoverImage,
      setLectures,

      // lecture helpers
      addLecture,
      updateLecture,
      setLectureFile,
      removeLecture,

      // getters
      getRequestCourseInfo,
      getImagesRaw,
      getLectures,

      // reset
      reset,
    }),
    [
      requestCourseInfo,
      thumbnailImages,
      courseCoverImage,
      lectures,
      setCourseField,
      setByPath,
      addLecture,
      updateLecture,
      setLectureFile,
      removeLecture,
      getRequestCourseInfo,
      getImagesRaw,
      getLectures,
      reset,
    ],
  );
}

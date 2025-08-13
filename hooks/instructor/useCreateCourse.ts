"use client";

import restClient from "@/lib/axios/restClient";
import type { LectureDTO } from "@/types/lecture";
import { isAxiosError, type AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";

/** ---------- Types ---------- */
interface RequestCourseInfo {
  title: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  categoryId: number;
  summary: string;
  maxEnrollments: number;
  description: string;
  level: number; // 0~5
  announcement: string;
  canLearns: string[];
}
type FileOrUrl = File | string;
interface CourseImagesRaw {
  thumbnails: FileOrUrl[];
  cover: FileOrUrl | null;
}
interface CreateCourseResponse {
  status: string;
  message: string;
  data?: { courseId: number };
}
interface ServerError {
  status?: string;
  message?: string;
  error?: string;
}

/** ---------- Utils ---------- */
function guessFilenameFromUrl(url: string, fallback: string): string {
  try {
    const u = new URL(url);
    const name = u.pathname.split("/").pop() ?? "";
    return name || fallback;
  } catch {
    return fallback;
  }
}
async function urlToFile(url: string, fallbackName: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch fail: ${url}`);
  const blob = await res.blob();
  return new File([blob], guessFilenameFromUrl(url, fallbackName), {
    type: blob.type || "application/octet-stream",
  });
}
function toIsoMaybe(v: string): string {
  if (!v) return v;
  if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v;
  const d = dayjs(v);
  return d.isValid() ? d.toISOString() : v;
}
function normalizeIso(v: string): string {
  return /^\d{4}-\d{2}-\d{2}T/.test(v) ? v : v;
}

/** LectureDTO[] → API payload (todos -> todoList) */
function lecturesDtoToApiPayload(lectures: LectureDTO[]) {
  return lectures.map((lec) => ({
    title: lec.title,
    summary: lec.summary,
    sequence: lec.sequence,
    materials: lec.materials ?? "",
    startedAt: normalizeIso(lec.startedAt),
    endedAt: normalizeIso(lec.endedAt),
    chapterList: (lec.chapterList ?? []).map((ch) => ({
      id: ch.id ?? 0,
      sequence: ch.sequence,
      title: ch.title,
      // DTO의 todos -> API의 todoList
      todoList: (ch.todoList ?? []).map((t) => ({
        id: t.id ?? 0,
        sequence: t.sequence,
        title: t.title,
        type: t.type, // "NORMAL"
        seconds: t.seconds ?? 0,
      })),
    })),
  }));
}

/** Postman과 동일한 멀티파트 구조: 강좌 등록용 */
async function buildCourseFormData(
  info: RequestCourseInfo,
  images: CourseImagesRaw,
): Promise<FormData> {
  const fd = new FormData();

  fd.append(
    "requestCourseInfo",
    new Blob(
      [
        JSON.stringify({
          ...info,
          enrollmentStartDate: toIsoMaybe(info.enrollmentStartDate),
          enrollmentEndDate: toIsoMaybe(info.enrollmentEndDate),
        }),
      ],
      { type: "application/json" },
    ),
    "requestCourseInfo.json",
  );

  for (const [i, t] of images.thumbnails.entries()) {
    let file: File;
    if (typeof t === "string") {
      file = await urlToFile(t, `thumbnail_${i}.jpg`);
    } else {
      file = t;
    }
    fd.append("thumbnailImages", file, file.name);
  }

  if (images.cover) {
    const coverFile =
      typeof images.cover === "string"
        ? await urlToFile(images.cover, "courseCover.jpg")
        : images.cover;
    fd.append("courseCoverImage", coverFile, coverFile.name);
  }

  return fd;
}
function logFormData(fd: FormData) {
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      console.log(key, `(File)`, value.name, value.size, value.type);
    } else {
      console.log(key, `(Text/Blob)`, value);
    }
  }
}
/** 강의 업로드용 멀티파트: lecture(JSON) + material/{idx}(파일) */
function buildLectureUploadFormData(lectures: LectureDTO[]): FormData {
  const fd = new FormData();

  // 1) lecture 전체 배열을 JSON Blob으로 변환 (Content-Type: application/json)
  const lecturePayload = lecturesDtoToApiPayload(lectures);
  fd.append(
    "lecture",
    new Blob([JSON.stringify(lecturePayload)], { type: "application/json" }),
  );

  // 2) 각 강의 자료 파일 추가
  lectures.forEach((lec, idx) => {
    if (lec.localMaterialFile) {
      fd.append(
        `material/${idx}`,
        lec.localMaterialFile,
        lec.localMaterialFile.name || `material_${idx}`,
      );
    }
  });
  logFormData(fd);
  return fd;
}

export function useCreateCourse() {
  const [requestCourseInfo, setRequestCourseInfo] = useState<RequestCourseInfo>(
    {
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

  const [thumbnailImages, setThumbnailImages] = useState<FileOrUrl[]>([]);
  const [courseCoverImage, setCourseCoverImage] = useState<FileOrUrl | null>(
    null,
  );
  const [lectures, setLectures] = useState<LectureDTO[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const setCourseField = <K extends keyof RequestCourseInfo>(
    key: K,
    value: RequestCourseInfo[K],
  ): void => {
    setRequestCourseInfo((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): { ok: boolean; messages: string[] } => {
    const msgs: string[] = [];
    const r = requestCourseInfo;
    if (!r.title.trim()) msgs.push("강좌명을 입력하세요.");
    if (!r.categoryId) msgs.push("카테고리를 선택하세요.");
    if (!r.summary.trim()) msgs.push("강좌 요약을 입력하세요.");
    if (!r.description.trim()) msgs.push("강좌 소개를 입력하세요.");
    if (!courseCoverImage) msgs.push("커버 이미지를 업로드하세요.");
    if (thumbnailImages.length === 0)
      msgs.push("썸네일 이미지를 1개 이상 업로드하세요.");
    return { ok: msgs.length === 0, messages: msgs };
  };

  async function createCourse(): Promise<number> {
    const fd = await buildCourseFormData(requestCourseInfo, {
      thumbnails: thumbnailImages,
      cover: courseCoverImage,
    });

    const res = await restClient.post<CreateCourseResponse>(
      "/course/courses",
      fd,
      {
        requireAuth: true,
        // 헤더 Content-Type은 자동(boundary 포함)
      },
    );

    const courseId = res.data?.data?.courseId;
    if (!courseId) throw new Error("courseId가 응답에 없습니다.");
    return courseId;
  }

  async function uploadLectures(
    courseId: number,
    list: LectureDTO[],
  ): Promise<void> {
    console.log("폼데이터 빌드 시작");
    const fd = buildLectureUploadFormData(list);
    console.log("폼데이터 빌드 완료");

    console.log(courseId);
    await restClient.post("/course/lecture", fd, {
      params: { courseId }, // ?courseId=...
      requireAuth: true,
    });
  }

  function extractServerMessage(err: AxiosError<ServerError>): string {
    return (
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message ??
      "요청 실패"
    );
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
    if (submitting) return;

    const { ok, messages } = validate();
    if (!ok) {
      alert(messages.join("\n"));
      return;
    }

    try {
      setSubmitting(true);
      // 1) 강좌 생성
      const courseId = await createCourse();
      // 2) 강의 업로드 (있을 때만)
      if (lectures.length > 0) {
        console.log("강의 등록");
        await uploadLectures(courseId, lectures);
      }
      alert(`강좌 등록 완료 (ID: ${courseId})`);
      // TODO: 필요 시 초기화 / 라우팅
      // setThumbnailImages([]); setCourseCoverImage(null); setLectures([]); ...
    } catch (err: unknown) {
      if (isAxiosError<ServerError>(err)) {
        const status = err.response?.status;
        if (status === 403)
          alert("권한이 없습니다. 강사 권한/승인 상태를 확인하세요.");
        else if (status === 400)
          alert("요청 형식을 확인하세요. (필드명/파일/JSON)");
        else alert(extractServerMessage(err));
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
      console.error("[submitAll] fail", err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    requestCourseInfo,
    setCourseField,
    thumbnailImages,
    setThumbnailImages,
    courseCoverImage,
    setCourseCoverImage,
    lectures,
    setLectures,
    submitting,
    onSubmit,
  };
}

// hooks/test/useTestSubmitCourse.ts
"use client";

import restClient from "@/lib/axios/restClient";
import type { LectureDTO } from "@/types/lecture";
import { useState } from "react";
import type { CourseImagesRaw, RequestCourseInfo } from "./useTestCourseForm";

/* ========= 유틸 ========= */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ApiTodo = {
  id?: number;
  sequence: number;
  title: string;
  type: string;
  seconds: number;
};
type ApiChapter = {
  id?: number;
  sequence: number;
  title: string;
  todoList: ApiTodo[];
};
type ApiLecture = Omit<LectureDTO, "chapterList" | "localMaterialFile"> & {
  chapterList: ApiChapter[];
};

async function logFormData(fd: FormData, label: string) {
  console.groupCollapsed(`[${label}] entries (deep)`);
  for (const [key, rawValue] of fd.entries()) {
    const value = rawValue as unknown; // 👈 타입 단언 추가

    if (value instanceof File) {
      console.log(
        `- ${key}: File(name="${value.name}", type="${value.type}", size=${value.size}B)`,
      );
      if (value.type.includes("json") || value.type.startsWith("text/")) {
        try {
          const txt = await value.text();
          try {
            console.log(`  ${key} (parsed JSON):`, JSON.parse(txt));
          } catch {
            console.log(`  ${key} (text):`, txt);
          }
        } catch {}
      }
    } else if (value instanceof Blob) {
      console.log(`- ${key}: Blob(type="${value.type}", size=${value.size}B)`);
      if (value.type === "application/json") {
        try {
          const txt = await value.text();
          console.log(`  ${key} (parsed JSON):`, JSON.parse(txt));
        } catch {
          try {
            const txt = await value.text();
            console.log(`  ${key} (text):`, txt);
          } catch {}
        }
      }
    } else {
      console.log(`- ${key}:`, value);
    }
  }
  console.groupEnd();
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toISOIfNeeded(s: string) {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s; // already ISO-like
  const [date, time = "00:00"] = s.split(" ");
  const [y, m, d] = (date || "").split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(
    y || 1970,
    (m || 1) - 1,
    d || 1,
    hh || 0,
    mm || 0,
  ).toISOString();
}

function isTodo(v: unknown): v is ApiTodo {
  return (
    isRecord(v) &&
    typeof v.title === "string" &&
    typeof (v as Record<string, unknown>).sequence !== "undefined"
  );
}
function isTodoArray(v: unknown): v is ApiTodo[] {
  return Array.isArray(v) && v.every(isTodo);
}
function toApiChapter(ch: unknown): ApiChapter {
  const obj = isRecord(ch) ? ch : {};
  const id = (obj["id"] as number | undefined) ?? undefined;
  const sequence = Number(obj["sequence"] ?? 0);
  const title =
    typeof obj["title"] === "string" ? (obj["title"] as string) : "";
  const raw = (obj["todoList"] as unknown) ?? (obj["todos"] as unknown) ?? [];
  const todoList = isTodoArray(raw) ? raw : [];
  return { id, sequence, title, todoList };
}
function normalizeLecturesForApi(lectures: LectureDTO[]): ApiLecture[] {
  return lectures.map((lec, idx) => {
    const apiChapters = Array.isArray(lec.chapterList)
      ? (lec.chapterList as unknown[]).map(toApiChapter)
      : [];
    return {
      title: String(lec.title ?? ""),
      summary: String(lec.summary ?? ""),
      sequence: Number.isFinite(lec.sequence) ? Number(lec.sequence) : idx,
      materials: typeof lec.materials === "string" ? lec.materials : "",
      startedAt: toISOIfNeeded(String(lec.startedAt ?? "")),
      endedAt: toISOIfNeeded(String(lec.endedAt ?? "")),
      chapterList: apiChapters,
    };
  });
}

// File/Blob 확인(브라우저 내)
function isBlobLike(v: unknown): v is Blob {
  return (
    isRecord(v) &&
    typeof (v as { size?: unknown }).size === "number" &&
    typeof (v as { type?: unknown }).type === "string" &&
    typeof (v as { slice?: unknown }).slice === "function"
  );
}
function getNameIfAny(f: unknown): string | undefined {
  if (isRecord(f) && typeof (f as { name?: unknown }).name === "string") {
    return (f as { name: string }).name;
  }
  return undefined;
}

/** 에러 객체에서 서버 메시지 뽑기 */
function extractServerMessage(data: unknown): string | undefined {
  if (isRecord(data)) {
    if (typeof data.message === "string" && data.message.trim())
      return data.message;
    // 혹시 nested
    if (isRecord(data.data) && typeof data.data.message === "string")
      return data.data.message;
  }
  return undefined;
}

type AxiosLikeResponse = { status?: number; data?: unknown; headers?: unknown };
type AxiosLikeError = {
  response?: AxiosLikeResponse;
  config?: { method?: string; url?: string; headers?: unknown };
  request?: unknown;
};
function guessFilenameFromUrl(url: string, fallback: string) {
  try {
    const u = new URL(url);
    const name = u.pathname.split("/").pop() || "";
    return name || fallback;
  } catch {
    return fallback;
  }
}

// URL(string) -> Blob 변환
async function toBlobFromUrl(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fail to fetch image: ${url}`);
  return await res.blob();
}

// Blob을 File로 감싸 파일명/타입 부여(선택)
function toFile(blob: Blob, filename: string): File {
  return new File([blob], filename, {
    type: blob.type || "application/octet-stream",
  });
}
/* ========= FormData 빌더 ========= */
// 1) 코스 생성 multipart
export async function buildCourseCreateFormData(
  info: RequestCourseInfo,
  images: CourseImagesRaw, // { thumbnails: (string|File)[], cover: string|File|null }
) {
  const fd = new FormData();

  // JSON 파트 (Postman에서 Text + application/json)
  fd.append(
    "requestCourseInfo",
    new Blob([JSON.stringify(info)], { type: "application/json" }),
  );

  // 썸네일들: 모두 File/Blob로 보장해서 append
  for (let i = 0; i < images.thumbnails.length; i++) {
    const t = images.thumbnails[i];
    if (!t) continue;

    if (typeof t === "string") {
      // URL이면 Blob으로 다운 → File로 감싸서 파일명 세팅
      const blob = await toBlobFromUrl(t);
      const file = toFile(blob, guessFilenameFromUrl(t, `thumbnail_${i}.jpg`));
      fd.append("thumbnailImages", file, file.name);
    } else {
      // 이미 File이면 그대로
      fd.append("thumbnailImages", t, t.name || `thumbnail_${i}.jpg`);
    }
  }

  // 커버 이미지
  const c = images.cover;
  if (c) {
    if (typeof c === "string") {
      const blob = await toBlobFromUrl(c);
      const file = toFile(blob, guessFilenameFromUrl(c, "courseCover.jpg"));
      fd.append("courseCoverImage", file, file.name);
    } else {
      fd.append("courseCoverImage", c, c.name || "courseCover.jpg");
    }
  }
  // ❌ else fd.append("courseCoverImage", "") 하지 마세요 (텍스트 파트가 되어버림)

  return fd;
}

// 2) 강의 업로드 multipart (백엔드 스펙: lecture(json), material/{sequence})
function buildLectureFormData(lectures: LectureDTO[]) {
  const fd = new FormData();

  const payload = normalizeLecturesForApi(lectures);
  fd.append(
    "lecture",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );

  lectures.forEach((lec, idx) => {
    const seq = Number.isFinite(lec.sequence) ? Number(lec.sequence) : idx;
    const local = (lec as unknown as { localMaterialFile?: unknown })
      .localMaterialFile;
    const fallback =
      typeof lec.materials !== "string"
        ? (lec.materials as unknown)
        : undefined;
    const blobLike = local ?? fallback;

    if (isBlobLike(blobLike)) {
      const name = getNameIfAny(blobLike);
      const key = `material/${seq}`;
      if (name) fd.append(key, blobLike, name);
      else fd.append(key, blobLike);
    }
  });

  return fd;
}

/* ========= API 호출 ========= */
async function createCourse(
  info: RequestCourseInfo,
  images: CourseImagesRaw,
): Promise<{ courseId: number | null; message?: string }> {
  const fd = await buildCourseCreateFormData(info, images);
  await logFormData(fd, "createCourse");
  console.log("[createCourse] POST /course/courses");

  try {
    console.log(
      "ㄴ마ㅓㅗㅇㄴ러ㅣㅇㄴ랴ㅓㅣㅏ라ㅓㅗㄴㄹㄷ아ㅓㅗㄴㅇ라ㅓㅗㅇㄴㄹ",
    );
    const res = await restClient.post("/course/courses", fd, {
      requireAuth: true,
    });
    console.log("[createCourse] 응답:", res.status, res.data);

    if (res.status !== 200) {
      return { courseId: null, message: extractServerMessage(res.data) };
    }

    const rawId = res.data.data.courseId;
    const courseId = Number(rawId);

    if (rawId == null)
      return { courseId: null, message: "courseId를 찾지 못했습니다." };

    console.log("[createCourse] 완료, courseId =", courseId);
    return { courseId };
  } catch (e) {
    console.log(e);
    const message =
      extractServerMessage((e as AxiosLikeError)?.response?.data) ||
      (e as Error).message;
    return { courseId: null, message };
  }
}

// 403/404/409 등 재시도 업로더 (커밋/권한/가시성 이슈 케이스)
async function uploadLecturesWithRetry(
  courseId: number,
  lectures: LectureDTO[],
  {
    maxRetries = 5,
    initialDelayMs = 300,
    backoff = 1.8,
    endpoint = "/course/lecture", // 실제 라우팅에 맞게 교체 가능
  }: {
    maxRetries?: number;
    initialDelayMs?: number;
    backoff?: number;
    endpoint?: string;
  } = {},
): Promise<{ ok: boolean; message?: string }> {
  const fd = buildLectureFormData(lectures);
  logFormData(fd, "uploadLectures");

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    const started = Date.now();
    console.log(
      `[uploadLectures] try #${
        attempt + 1
      } → POST ${endpoint}?courseId=${courseId} (delay=${
        attempt === 0 ? 0 : delay
      }ms)`,
    );
    if (attempt > 0) await sleep(delay);

    try {
      const res = await restClient.post(endpoint, fd, {
        requireAuth: true,
        params: { courseId },
      });
      console.log(
        "[uploadLectures] 응답:",
        res.status,
        res.data,
        `(+${Date.now() - started}ms)`,
      );

      if (res.status === 200) return { ok: true };
      const msg = extractServerMessage(res.data);
      console.log("[uploadLectures] 비정상 status:", res.status, res.data);
      return { ok: false, message: msg };
    } catch (err) {
      console.log(err);
      const ax = err as AxiosLikeError;
      const sc = ax.response?.status;
      const msg = extractServerMessage(ax.response?.data);

      console.warn(
        `[uploadLectures] 실패(status=${sc}) attempt #${attempt + 1} message=${
          msg ?? "(없음)"
        }`,
      );

      // 컨트롤러 진입·권한·가시성 이슈로 보이는 코드들만 백오프 재시도
      if (sc === 403 || sc === 404 || sc === 409) {
        if (attempt < maxRetries) {
          attempt += 1;
          delay = Math.round(delay * backoff);
          continue;
        }
        return { ok: false, message: msg };
      }

      // 그 외 즉시 실패
      return { ok: false, message: msg };
    }
  }

  return { ok: false, message: "재시도 한도를 초과했습니다." };
}

/* ========= Hook ========= */
export type SubmitArgs = {
  requestCourseInfo: RequestCourseInfo;
  imagesRaw: CourseImagesRaw;
  lectures: LectureDTO[];
  onReset?: () => void;
};

export function useSubmitCourse() {
  const [submitting, setSubmitting] = useState(false);

  const submitAll = async (
    args: SubmitArgs,
  ): Promise<{
    success: boolean;
    courseId?: number;
    errorMessage?: string;
  }> => {
    if (submitting)
      return { success: false, errorMessage: "이미 처리 중입니다." };

    setSubmitting(true);
    try {
      console.log("[submitAll] 시작", {
        lecturesCount: args.lectures?.length ?? 0,
      });

      // 1) 강좌 생성 (커밋 완료 후 ID 반환)
      console.log(`args: ${JSON.stringify(args)}`);
      const { courseId, message: createMsg } = await createCourse(
        args.requestCourseInfo,
        args.imagesRaw,
      );

      console.log(courseId);
      if (!courseId) {
        console.error("[submitAll] 코스 생성 실패:", createMsg);
        return { success: false, errorMessage: createMsg ?? "코스 생성 실패" };
      }

      // 2) 짧은 대기(커밋-가시성 보정)
      await sleep(350);

      // 3) 강의 업로드(재시도 포함)
      if (args.lectures?.length) {
        // TIP: 코스 “수강신청 기간”을 args.lectures의 startedAt/endedAt가 벗어나지 않게 프론트에서 한 번 더 검사 가능
        const { ok, message } = await uploadLecturesWithRetry(
          courseId,
          args.lectures,
          {
            maxRetries: 5,
            initialDelayMs: 300,
            backoff: 1.8,
            endpoint: "/course/lecture", // 실제 서버 라우팅에 맞게
          },
        );
        if (!ok) {
          console.error("[submitAll] 강의 업로드 실패:", message);
          return {
            success: false,
            courseId,
            errorMessage: message ?? "강의 업로드 실패",
          };
        }
      } else {
        console.log("[submitAll] 강의 0건 → 업로드 스킵");
      }

      console.log("[submitAll] 전체 완료");
      args.onReset?.();
      window.scrollTo({ top: 0, behavior: "smooth" });

      return { success: true, courseId };
    } catch (err) {
      const ax = err as AxiosLikeError;
      const sc = ax.response?.status;
      const msg = extractServerMessage(ax.response?.data);

      console.log(err);
      // 에러 상세 콘솔
      console.group("[submitAll] 요청 오류");
      console.log("status:", sc);
      if (ax.response) {
        console.log("response.data:", ax.response.data);
        console.log("response.headers:", ax.response.headers);
      }
      if (ax.config) {
        console.log("config.method:", ax.config.method);
        console.log("config.url:", ax.config.url);
        console.log("config.headers:", ax.config.headers);
      }
      if (ax.request) {
        console.log("raw request:", ax.request);
      }
      console.groupEnd();

      return { success: false, errorMessage: msg ?? "요청 실패" };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, submitAll };
}

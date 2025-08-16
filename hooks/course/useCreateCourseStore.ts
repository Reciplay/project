import { RULE } from "@/stores/ruleCourse";
import type { CreateCourseRequestFinal } from "@/types/course";
import { create } from "zustand";

// useCreateCourseStore.ts
export type FieldKey = Keys; // ✅ 외부에서 쓸 수 있게 공개

type TodoType = "NORMAL" | "TIMER";
type Todo = {
  sequence: number;
  title: string;
  type: TodoType;
  seconds: number;
};
type Chapter = { sequence: number; title: string; todoList: Todo[] };
type Lecture = {
  title: string;
  summary: string;
  sequence: number; // 0부터 시작 (중요)
  materials: File | string; // 파일이거나 이미 업로드된 URL 문자열
  startedAt: string; // "YYYY-MM-DD HH:mm" 또는 ISO
  endedAt: string; // 동일
  chapterList: Chapter[];
};
function toISOIfNeeded(s: string) {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s;

  const [datePart = "", timePart = "00:00"] = s.split(" ");
  const [y = 0, m = 1, d = 1] = datePart.split("-").map((n) => Number(n));
  const [hh = 0, mm = 0] = timePart.split(":").map((n) => Number(n));

  return new Date(y, m - 1, d, hh, mm).toISOString();
}

type Draft = {
  requestCourseInfo: {
    title: string;
    enrollmentStartDate: string; // "YYYY-MM-DD HH:mm" 로 보관(인터페이스용)
    enrollmentEndDate: string; // "
    categoryId?: number; // 선택 전 undefined
    summary: string;
    maxEnrollments: number;
    description: string;
    level: number;
    announcement: string;
    canLearns: string[];
  };
  thumbnailImages: (File | string)[]; // multipart 전환 대비
  courseCoverImage: File | string | null;
  lectures: Lecture[];
};

type ErrorMap = Partial<
  Record<
    | "requestCourseInfo.title"
    | "requestCourseInfo.enrollmentStartDate"
    | "requestCourseInfo.enrollmentEndDate"
    | "requestCourseInfo.categoryId"
    | "requestCourseInfo.summary"
    | "requestCourseInfo.maxEnrollments"
    | "requestCourseInfo.description"
    | "requestCourseInfo.level"
    | "requestCourseInfo.announcement"
    | "requestCourseInfo.canLearns"
    | "thumbnailImages"
    | "courseCoverImage",
    string
  >
>;

type Keys = keyof ErrorMap;

type State = {
  values: Draft;
  errors: ErrorMap;
  setField: (key: Keys, value: unknown) => void;
  setRange: (start: string, end: string) => void;
  validateAll: () => { ok: boolean; messages: string[] };
  buildPayload: () => CreateCourseRequestFinal;
  buildFormData: () => FormData; // ✅ 추가
  reset: () => void;
  setLectures: (lectures: Lecture[]) => void;
};

import restClient from "@/lib/axios/restClient";

export function buildLectureFormData(lectures: Lecture[]) {
  const fd = new FormData();

  const lectureJson = lectures.map((lec, idx) => ({
    title: lec.title,
    summary: lec.summary,
    sequence: Number(lec.sequence ?? idx),
    materials: typeof lec.materials === "string" ? lec.materials : "",
    startedAt: toISOIfNeeded(lec.startedAt),
    endedAt: toISOIfNeeded(lec.endedAt),
    chapterList: lec.chapterList,
  }));

  fd.append(
    "lecture",
    new Blob([JSON.stringify(lectureJson)], { type: "application/json" }),
  );

  lectures.forEach((lec, idx) => {
    const seq = Number.isFinite(lec.sequence) ? Number(lec.sequence) : idx;
    if (lec.materials instanceof File) {
      fd.append(`material/${seq}`, lec.materials, lec.materials.name);
    }
  });

  return fd;
}

export async function uploadLectures(courseId: number, lectures: Lecture[]) {
  const formData = buildLectureFormData(lectures);
  return await restClient.post("/course/lecture", formData, {
    requireAuth: true,
    params: { courseId },
  });
}

function toISO(local: string) {
  if (!local) return "";
  const [datePart = "", timePart = "00:00"] = local.split(" ");
  const [y = 0, m = 1, d = 1] = datePart.split("-").map((n) => Number(n));
  const [hh = 0, mm = 0] = timePart.split(":").map((n) => Number(n));
  return new Date(y, m - 1, d, hh, mm).toISOString();
}
function buildInfoJson(values: Draft) {
  const info = values.requestCourseInfo;
  return {
    title: info.title,
    enrollmentStartDate: toISO(info.enrollmentStartDate),
    enrollmentEndDate: toISO(info.enrollmentEndDate),
    categoryId: Number(info.categoryId ?? 0),
    maxEnrollments: Number(info.maxEnrollments ?? 0),
    level: Number(info.level ?? 0),
    summary: info.summary,
    description: info.description,
    announcement: info.announcement ?? "",
    canLearns: info.canLearns, // 배열 그대로
  };
}
const initialValues: Draft = {
  requestCourseInfo: {
    title: "",
    enrollmentStartDate: "", // "YYYY-MM-DD HH:mm"
    enrollmentEndDate: "",
    categoryId: undefined,
    summary: "",
    maxEnrollments: 0,
    description: "",
    level: 0,
    announcement: "",
    canLearns: [],
  },
  thumbnailImages: [],
  courseCoverImage: null,
  lectures: [], // ✅
};

export const useCreateCourseStore = create<State>((set, get) => ({
  values: initialValues,
  errors: {},
  setLectures: (lectures) => {
    set((s) => ({ values: { ...s.values, lectures } }));
  },
  setField: (key, value) => {
    const { values, errors } = get();
    const next = structuredClone(values) as Draft;

    // string path 적용
    const apply = (k: Keys, v: unknown) => {
      const [a, b] = k.split(".") as [keyof Draft | string, string?];

      if (b) {
        // 현재 dotted key는 requestCourseInfo.* 만 존재
        if (a === "requestCourseInfo") {
          (next.requestCourseInfo as Record<string, unknown>)[b] = v;
        }
        // (필요 시 다른 dotted 경로가 생기면 여기에 else-if 추가)
      } else {
        (next as unknown as Record<string, unknown>)[a] = v;
      }
    };
    apply(key, value);

    // 즉시 밸리데이션
    const nextErrors: ErrorMap = { ...errors };
    const info = next.requestCourseInfo;

    const setErr = (k: Keys, msg?: string) => {
      if (msg) nextErrors[k] = msg;
      else delete nextErrors[k];
    };

    switch (key) {
      case "requestCourseInfo.title": {
        if (!info.title.trim()) setErr(key, "강좌명을 입력해주세요");
        else if (info.title.length > RULE.TITLE_MAX)
          setErr(key, `제목은 ${RULE.TITLE_MAX}자 이하여야 합니다`);
        else setErr(key);
        break;
      }
      case "requestCourseInfo.summary": {
        if (!info.summary.trim()) setErr(key, "요약을 입력해주세요");
        else if (info.summary.length > RULE.SUMMARY_MAX)
          setErr(key, `요약은 ${RULE.SUMMARY_MAX}자 이하여야 합니다`);
        else setErr(key);
        break;
      }
      case "requestCourseInfo.categoryId": {
        if (!info.categoryId || info.categoryId < 1)
          setErr(key, "카테고리를 선택해주세요");
        else setErr(key);
        break;
      }
      case "requestCourseInfo.maxEnrollments": {
        const n = Number(info.maxEnrollments || 0);
        if (n < 1) setErr(key, "모집 인원은 1명 이상이어야 합니다");
        else if (n > RULE.MAX_ENROLLMENTS_MAX)
          setErr(key, `모집 인원은 최대 ${RULE.MAX_ENROLLMENTS_MAX}명입니다`);
        else setErr(key);
        break;
      }
      case "requestCourseInfo.level": {
        const n = Number(info.level || 0);
        if (n < RULE.LEVEL_MIN || n > RULE.LEVEL_MAX)
          setErr(
            key,
            `난이도는 ${RULE.LEVEL_MIN}~${RULE.LEVEL_MAX} 사이여야 합니다`,
          );
        else setErr(key);
        break;
      }
      case "requestCourseInfo.description": {
        if (!info.description.trim()) setErr(key, "강좌 소개를 입력해주세요");
        else setErr(key);
        break;
      }
      case "requestCourseInfo.canLearns": {
        if (!info.canLearns || info.canLearns.length < RULE.CANLEARNS_MIN)
          setErr(key, "배울 수 있는 내용을 1개 이상 입력해주세요");
        else setErr(key);
        break;
      }
      case "requestCourseInfo.enrollmentStartDate":
      case "requestCourseInfo.enrollmentEndDate": {
        // 존재 체크만 즉시, 순서 검사는 validateAll에서 같이
        if (!value)
          setErr(
            key,
            key.endsWith("StartDate")
              ? "수강 시작일을 선택해주세요"
              : "수강 종료일을 선택해주세요",
          );
        else setErr(key);
        break;
      }
      default:
        // 썸네일/커버는 multipart 전환 시 여기서 검사 추가하면 됨
        break;
    }

    set({ values: next, errors: nextErrors });
  },

  setRange: (start, end) => {
    const s = useCreateCourseStore.getState();
    s.setField("requestCourseInfo.enrollmentStartDate", start);
    s.setField("requestCourseInfo.enrollmentEndDate", end);
  },

  validateAll: () => {
    const { values, errors } = get();
    const msgs: string[] = [];
    const info = values.requestCourseInfo;

    // 누락/형식 순회
    const push = (k: Keys, msg: string) => {
      msgs.push(msg);
      // 에러 객체에도 보장
      const next = { ...errors, [k]: msg };
      set({ errors: next });
    };

    // 제목/요약/설명
    if (!info.title.trim())
      push("requestCourseInfo.title", "강좌명을 입력해주세요");
    else if (info.title.length > RULE.TITLE_MAX)
      push(
        "requestCourseInfo.title",
        `제목은 ${RULE.TITLE_MAX}자 이하여야 합니다`,
      );

    if (!info.summary.trim())
      push("requestCourseInfo.summary", "요약을 입력해주세요");
    else if (info.summary.length > RULE.SUMMARY_MAX)
      push(
        "requestCourseInfo.summary",
        `요약은 ${RULE.SUMMARY_MAX}자 이하여야 합니다`,
      );

    if (!info.description.trim())
      push("requestCourseInfo.description", "강좌 소개를 입력해주세요");

    // 카테고리/정원/난이도
    if (!info.categoryId || info.categoryId < 1)
      push("requestCourseInfo.categoryId", "카테고리를 선택해주세요");

    const maxN = Number(info.maxEnrollments || 0);
    if (maxN < 1)
      push(
        "requestCourseInfo.maxEnrollments",
        "모집 인원은 1명 이상이어야 합니다",
      );
    else if (maxN > RULE.MAX_ENROLLMENTS_MAX)
      push(
        "requestCourseInfo.maxEnrollments",
        `모집 인원은 최대 ${RULE.MAX_ENROLLMENTS_MAX}명입니다`,
      );

    const lv = Number(info.level || 0);
    if (lv < RULE.LEVEL_MIN || lv > RULE.LEVEL_MAX)
      push(
        "requestCourseInfo.level",
        `난이도는 ${RULE.LEVEL_MIN}~${RULE.LEVEL_MAX} 사이여야 합니다`,
      );

    // 날짜 존재 + 순서
    if (!info.enrollmentStartDate)
      push(
        "requestCourseInfo.enrollmentStartDate",
        "수강 시작일을 선택해주세요",
      );
    if (!info.enrollmentEndDate)
      push("requestCourseInfo.enrollmentEndDate", "수강 종료일을 선택해주세요");
    if (info.enrollmentStartDate && info.enrollmentEndDate) {
      const s = new Date(info.enrollmentStartDate.replace(" ", "T")).getTime();
      const e = new Date(info.enrollmentEndDate.replace(" ", "T")).getTime();
      if (!Number.isNaN(s) && !Number.isNaN(e) && s >= e)
        push(
          "requestCourseInfo.enrollmentEndDate",
          "수강 종료일은 시작일 이후여야 합니다",
        );
    }

    // canLearns
    if (!info.canLearns || info.canLearns.length < RULE.CANLEARNS_MIN)
      push(
        "requestCourseInfo.canLearns",
        "배울 수 있는 내용을 1개 이상 입력해주세요",
      );

    return { ok: msgs.length === 0, messages: msgs };
  },
  buildFormData: () => {
    const { values } = get();
    const fd = new FormData();

    // 1) JSON DTO를 하나의 파트로
    const infoJson = buildInfoJson(values);
    fd.append(
      "requestCourseInfo",
      new Blob([JSON.stringify(infoJson)], { type: "application/json" }),
    );

    // 2) 파일 파트들
    values.thumbnailImages.forEach((item) => {
      if (item instanceof File) {
        fd.append("thumbnailImages", item, item.name);
      } else if (typeof item === "string" && item) {
        // 이미 업로드된 URL도 함께 보내야 한다면 백엔드 키에 맞춰 전송
        // (키 이름은 서버와 합의: thumbnailImageUrls 또는 기존 필드명)
        fd.append("thumbnailImageUrls", item);
      }
    });

    if (values.courseCoverImage instanceof File) {
      fd.append(
        "courseCoverImage",
        values.courseCoverImage,
        values.courseCoverImage.name,
      );
    } else if (
      typeof values.courseCoverImage === "string" &&
      values.courseCoverImage
    ) {
      fd.append("courseCoverImageUrl", values.courseCoverImage);
    }

    return fd;
  },

  buildPayload: () => {
    const { values } = get();
    const info = values.requestCourseInfo;
    const payload: CreateCourseRequestFinal = {
      requestCourseInfo: {
        title: info.title,
        categoryId: Number(info.categoryId ?? 0),
        maxEnrollments: Number(info.maxEnrollments ?? 0),
        level: Number(info.level ?? 0),
        enrollmentStartDate: toISO(info.enrollmentStartDate),
        enrollmentEndDate: toISO(info.enrollmentEndDate),
        summary: info.summary,
        description: info.description,
        // announcement: swagger는 string이므로 빈문자열 허용(원하면 undefined 처리 가능)
        announcement: info.announcement ?? "",
        canLearns: info.canLearns,
      },
      // 이미지들은 추후 multipart에서 FormData로 변환
      thumbnailImages: values.thumbnailImages as string[],
      courseCoverImage: (values.courseCoverImage ?? "") as string,
    };
    return payload;
  },

  reset: () => set({ values: initialValues, errors: {} }),
}));

import { create } from "zustand";
import type { CreateCourseRequestFinal } from "@/types/course";
import { RULE } from '@/stores/ruleCourse'

// useCreateCourseStore.ts
export type FieldKey = Keys; // ✅ 외부에서 쓸 수 있게 공개

type TodoType = 'NORMAL'; // 필요 시 'TIMER' 등 확장
type Todo = { sequence: number; title: string; type: TodoType; seconds: number };
type Chapter = { sequence: number; title: string; todoList: Todo[] };
type Lecture = {
  title: string;
  summary: string;
  sequence: number;
  materials: string;
  startedAt: string;   // ISO
  endedAt: string;     // ISO
  chapterList: Chapter[];
};

type Draft = {
  requestCourseInfo: {
    title: string;
    enrollmentStartDate: string; // "YYYY-MM-DD HH:mm" 로 보관(인터페이스용)
    enrollmentEndDate: string;   // "
    categoryId?: number;         // 선택 전 undefined
    summary: string;
    maxEnrollments: number;
    description: string;
    level: number;
    announcement: string;
    canLearns: string[];
  };
  thumbnailImages: (File | string)[]; // multipart 전환 대비
  courseCoverImage: File | string | null;
};

type ErrorMap = Partial<Record<
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
  | "courseCoverImage"
  , string>>;


type Keys = keyof ErrorMap;

type State = {
  values: Draft;
  errors: ErrorMap;

  // 필드별 입력 + 즉시 밸리데이션
  setField: (key: Keys, value: any) => void;

  // RangePicker 전용(둘 다 동시에 세팅)
  setRange: (start: string, end: string) => void;

  // 전체 검증(저장 버튼 때)
  validateAll: () => { ok: boolean; messages: string[] };

  // 서버 전송 페이로드(ISO 변환 포함)
  buildPayload: () => CreateCourseRequestFinal;

  reset: () => void;
};

function toISO(local: string) {
  if (!local) return "";
  const [date, time] = local.split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time ?? "00:00").split(":").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
}

const initialValues: Draft = {
  requestCourseInfo: {
    title: "",
    enrollmentStartDate: "",   // "YYYY-MM-DD HH:mm"
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
};

export const useCreateCourseStore = create<State>((set, get) => ({
  values: initialValues,
  errors: {},

  setField: (key, value) => {
    const { values, errors } = get();

    // 값 갱신(얕은 복사)
    const next = structuredClone(values) as Draft;
    // string path 적용
    const apply = (k: Keys, v: any) => {
      const [a, b] = k.split(".");
      if (b) {
        (next as any)[a][b] = v;
      } else {
        (next as any)[a] = v;
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
          setErr(key, `난이도는 ${RULE.LEVEL_MIN}~${RULE.LEVEL_MAX} 사이여야 합니다`);
        else setErr(key);
        break;
      }
      case "requestCourseInfo.description": {
        if (!info.description.trim())
          setErr(key, "강좌 소개를 입력해주세요");
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
        if (!value) setErr(key, key.endsWith("StartDate") ? "수강 시작일을 선택해주세요" : "수강 종료일을 선택해주세요");
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
    if (!info.title.trim()) push("requestCourseInfo.title", "강좌명을 입력해주세요");
    else if (info.title.length > RULE.TITLE_MAX)
      push("requestCourseInfo.title", `제목은 ${RULE.TITLE_MAX}자 이하여야 합니다`);

    if (!info.summary.trim()) push("requestCourseInfo.summary", "요약을 입력해주세요");
    else if (info.summary.length > RULE.SUMMARY_MAX)
      push("requestCourseInfo.summary", `요약은 ${RULE.SUMMARY_MAX}자 이하여야 합니다`);

    if (!info.description.trim())
      push("requestCourseInfo.description", "강좌 소개를 입력해주세요");

    // 카테고리/정원/난이도
    if (!info.categoryId || info.categoryId < 1)
      push("requestCourseInfo.categoryId", "카테고리를 선택해주세요");

    const maxN = Number(info.maxEnrollments || 0);
    if (maxN < 1) push("requestCourseInfo.maxEnrollments", "모집 인원은 1명 이상이어야 합니다");
    else if (maxN > RULE.MAX_ENROLLMENTS_MAX)
      push("requestCourseInfo.maxEnrollments", `모집 인원은 최대 ${RULE.MAX_ENROLLMENTS_MAX}명입니다`);

    const lv = Number(info.level || 0);
    if (lv < RULE.LEVEL_MIN || lv > RULE.LEVEL_MAX)
      push("requestCourseInfo.level", `난이도는 ${RULE.LEVEL_MIN}~${RULE.LEVEL_MAX} 사이여야 합니다`);

    // 날짜 존재 + 순서
    if (!info.enrollmentStartDate)
      push("requestCourseInfo.enrollmentStartDate", "수강 시작일을 선택해주세요");
    if (!info.enrollmentEndDate)
      push("requestCourseInfo.enrollmentEndDate", "수강 종료일을 선택해주세요");
    if (info.enrollmentStartDate && info.enrollmentEndDate) {
      const s = new Date(info.enrollmentStartDate.replace(" ", "T")).getTime();
      const e = new Date(info.enrollmentEndDate.replace(" ", "T")).getTime();
      if (!Number.isNaN(s) && !Number.isNaN(e) && s >= e)
        push("requestCourseInfo.enrollmentEndDate", "수강 종료일은 시작일 이후여야 합니다");
    }

    // canLearns
    if (!info.canLearns || info.canLearns.length < RULE.CANLEARNS_MIN)
      push("requestCourseInfo.canLearns", "배울 수 있는 내용을 1개 이상 입력해주세요");

    return { ok: msgs.length === 0, messages: msgs };
  },

  buildPayload: () => {
    const { values } = get();
    const info = values.requestCourseInfo;
    const payload: CreateCourseRequestFinal = {
      requestCourseInfo: {
        title: info.title,
        enrollmentStartDate: toISO(info.enrollmentStartDate),
        enrollmentEndDate: toISO(info.enrollmentEndDate),
        categoryId: Number(info.categoryId), // undefined였으면 validateAll에서 막힘
        summary: info.summary,
        maxEnrollments: Number(info.maxEnrollments),
        description: info.description,
        level: Number(info.level),
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
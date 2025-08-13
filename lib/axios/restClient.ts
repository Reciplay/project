// import axios, {
//   AxiosError,
//   AxiosHeaders,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { getSession } from "next-auth/react";

// /* ──────────────────────────────
//  * Axios 확장 옵션
//  * ────────────────────────────── */
// declare module "axios" {
//   export interface AxiosRequestConfig {
//     requireAuth?: boolean;
//     useCors?: boolean;
//     /** 콘솔 출력 억제 (요청 단위) */
//     silentLog?: boolean;
//     /** 이 요청만 민감정보 마스킹 해제 (개발 중 디버깅용) */
//     allowSensitiveLog?: boolean;
//   }

//   export interface InternalAxiosRequestConfig {
//     /** 요청-응답 시간 측정/추척용 메타데이터 */
//     _meta?: {
//       startTime: number;
//       requestId: string;
//     };
//   }
// }

// /* ──────────────────────────────
//  * 유틸: ID/마스킹/시리얼라이즈
//  * ────────────────────────────── */
// const VERBOSE = process.env.DEBUG_VERBOSE === "true";

// /** 간단한 요청 ID */
// const newRequestId = () =>
//   `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// /** AxiosHeaders/기타 값을 안전한 Plain Object로 변환 */
// function headersToPlainObject(headers: unknown): Record<string, unknown> {
//   if (!headers) return {};
//   if (headers instanceof AxiosHeaders) {
//     return headers.toJSON() as Record<string, unknown>;
//   }
//   if (typeof headers === "object" && !Array.isArray(headers)) {
//     return headers as Record<string, unknown>;
//   }
//   return {};
// }

// /** Authorization 등 민감 값 마스킹 */
// // function mask(value: unknown) {
// //   if (typeof value !== "string") return value;
// //   if (value.length <= 12) return "****";
// //   return `${value.slice(0, 6)}...${value.slice(-4)}`;
// // }

// /** 민감 헤더 마스킹 (항상 Plain Object에서만 스프레드) */
// function maskHeaders(headers: unknown, allowSensitive = false) {
//   const plain = headersToPlainObject(headers);
//   if (allowSensitive) return plain;

//   const clone: Record<string, unknown> = {
//     ...(plain as Record<string, unknown>),
//   };
//   for (const k of Object.keys(clone)) {
//     const low = k.toLowerCase();
//     if (["authorization", "cookie", "set-cookie", "x-api-key"].includes(low)) {
//       const val = String(clone[k] ?? "");
//       clone[k] =
//         val.length > 12 ? `${val.slice(0, 6)}...${val.slice(-4)}` : "****";
//     }
//   }
//   return clone;
// }

// // 타입가드
// const isFileLike = (x): x is { name: string; size: number; type?: string } =>
//   !!x && typeof x === "object" && "name" in x && "size" in x;

// const isBlobLike = (x): x is { size: number; type?: string } =>
//   !!x &&
//   typeof x === "object" &&
//   "size" in x &&
//   typeof x.arrayBuffer === "function";

// // FormData → 로깅용
// async function formDataToDebugArray(fd: FormData) {
//   const out: Array<{ key: string; type: string; value: unknown }> = [];
//   for (const [key, v] of fd.entries() as Iterable<[string, any]>) {
//     if (typeof v === "string") {
//       out.push({ key, type: "text", value: v });
//     } else if (isFileLike(v)) {
//       out.push({
//         key,
//         type: "file",
//         value: {
//           name: v.name,
//           size: v.size,
//           mime: v.type ?? "application/octet-stream",
//         },
//       });
//     } else if (isBlobLike(v)) {
//       out.push({
//         key,
//         type: "blob",
//         value: { size: v.size, mime: v.type ?? "application/octet-stream" },
//       });
//     } else {
//       out.push({ key, type: typeof v, value: v });
//     }
//   }
//   return out;
// }

// function isFormData(x): x is FormData {
//   return typeof FormData !== "undefined" && x instanceof FormData;
// }

// /** 요청 body/params 시리얼라이즈 (FormData/Blob 등 안전 처리) */
// async function serializeData(data): Promise<unknown> {
//   if (!data) return data;
//   if (isFormData(data)) return formDataToDebugArray(data);
//   if (isBlobLike(data)) {
//     return {
//       type: "blob",
//       size: data.size,
//       mime: data.type || "application/octet-stream",
//     };
//   }
//   if (typeof data === "string") return data;
//   try {
//     return JSON.parse(JSON.stringify(data));
//   } catch {
//     return String(data);
//   }
// }

// /** 에러 메시지 표준화 */
// export function extractAxiosErrorMessage(e: unknown, fallback = "요청 실패") {
//   const ax = e as AxiosError<any>;
//   if (ax?.response?.data?.message) return String(ax.response.data.message);
//   if (ax?.response?.data?.error) return String(ax.response.data.error);
//   if (ax?.message) return ax.message;
//   return fallback;
// }

// /* ──────────────────────────────
//  * Axios 인스턴스
//  * ────────────────────────────── */
// const restClient = axios.create({
//   baseURL: "/api/rest",
//   timeout: 10000,
// });

// /* ──────────────────────────────
//  * 요청 인터셉터
//  * ────────────────────────────── */
// restClient.interceptors.request.use(
//   async (
//     config: InternalAxiosRequestConfig,
//   ): Promise<InternalAxiosRequestConfig> => {
//     // 메타데이터 세팅
//     config._meta = { startTime: performance.now(), requestId: newRequestId() };

//     // baseURL 스위칭 (프록시 우회)
//     config.baseURL =
//       config.useCors === false
//         ? "http://i13e104.p.ssafy.io:8080/api/v1/"
//         : "/api/rest";

//     // 인증 헤더 세팅
//     if (config.requireAuth) {
//       const session = await getSession();
//       const accessToken = session?.accessToken;

//       if (accessToken) {
//         // Ensure config.headers is an AxiosHeaders instance
//         if (!(config.headers instanceof AxiosHeaders)) {
//           // If it's not AxiosHeaders, convert it to AxiosHeaders
//           // This handles cases where config.headers might be a plain object or undefined
//           config.headers = new AxiosHeaders(config.headers);
//         }
//         config.headers.set("Authorization", accessToken);
//       }
//     }

//     // 로깅
//     if (!config.silentLog) {
//       const base = config.baseURL ?? "";
//       const path = config.url ?? "";
//       const fullUrl = `${base}${path}`;

//       const allowSensitive = !!config.allowSensitiveLog;
//       const safeHeaders = maskHeaders(config.headers, allowSensitive);

//       const payload =
//         config.method?.toLowerCase() === "get"
//           ? undefined
//           : await serializeData(config.data);
//       const params = await serializeData(config.params);

//       console.groupCollapsed(
//         `%c[REST →] ${config._meta.requestId} ${(
//           config.method ?? "GET"
//         ).toUpperCase()} ${fullUrl}`,
//         "color:#0ea5e9",
//       );
//       console.log(
//         "requireAuth:",
//         !!config.requireAuth,
//         "useCors:",
//         config.useCors,
//       );
//       console.log("headers:", safeHeaders);
//       if (params !== undefined) console.log("params:", params);
//       if (payload !== undefined) console.log("data:", payload);
//       console.groupEnd();
//     }

//     return config;
//   },
// );

// /* ──────────────────────────────
//  * 응답 인터셉터
//  * ────────────────────────────── */
// restClient.interceptors.response.use(
//   async (response: AxiosResponse) => {
//     const cfg = response.config as InternalAxiosRequestConfig;
//     const dur =
//       cfg?._meta?.startTime != null
//         ? Math.round(performance.now() - cfg._meta.startTime)
//         : undefined;

//     if (!cfg?.silentLog) {
//       const base = cfg.baseURL ?? "";
//       const path = cfg.url ?? "";
//       const fullUrl = `${base}${path}`;

//       const allowSensitive = !!cfg.allowSensitiveLog;
//       const safeResHeaders = maskHeaders(response.headers, allowSensitive);

//       const preview =
//         typeof response.data === "string"
//           ? response.data.slice(0, 600)
//           : response.data;

//       console.groupCollapsed(
//         `%c[REST ←] ${cfg?._meta?.requestId ?? "-"} ${response.status} ${fullUrl} ${
//           dur ? `(${dur}ms)` : ""
//         }`,
//         "color:#22c55e",
//       );
//       console.log("status:", response.status, response.statusText);
//       console.log("headers:", safeResHeaders);
//       console.log("data:", VERBOSE ? response.data : preview);
//       console.groupEnd();
//     }

//     return response;
//   },
//   async (error: AxiosError) => {
//     const cfg = (error.config ?? {}) as InternalAxiosRequestConfig;
//     const dur =
//       cfg?._meta?.startTime != null
//         ? Math.round(performance.now() - cfg._meta.startTime)
//         : undefined;

//     const base = cfg.baseURL ?? "";
//     const path = cfg.url ?? "";
//     const fullUrl = `${base}${path}`;

//     const allowSensitive = !!cfg?.allowSensitiveLog;
//     const safeReqHeaders = maskHeaders(cfg?.headers, allowSensitive);
//     const params = await serializeData(cfg?.params);
//     const payload =
//       cfg?.method?.toLowerCase() === "get"
//         ? undefined
//         : await serializeData(cfg?.data);

//     const res = error.response;
//     const safeResHeaders = res
//       ? maskHeaders(res.headers, allowSensitive)
//       : null;

//     console.groupCollapsed(
//       `%c[REST ✖] ${cfg?._meta?.requestId ?? "-"} ${res?.status ?? "ERR"} ${fullUrl} ${
//         dur ? `(${dur}ms)` : ""
//       }`,
//       "color:#ef4444",
//     );
//     console.log("code:", error.code);
//     console.log("message:", error.message);
//     console.log("request.headers:", safeReqHeaders);
//     if (params !== undefined) console.log("request.params:", params);
//     if (payload !== undefined) console.log("request.data:", payload);
//     if (res) {
//       console.log("response.status:", res.status, res.statusText);
//       console.log("response.headers:", safeResHeaders);
//       console.log("response.data:", res.data);
//     }
//     console.groupEnd();

//     return Promise.reject(error);
//   },
// );

// export default restClient;
// lib/axios/restClient.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";

/* ──────────────────────────────
 * Axios 확장 옵션
 * ────────────────────────────── */
declare module "axios" {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
    useCors?: boolean;
    /** 콘솔 출력 억제 (요청 단위) */
    silentLog?: boolean;
    /** 이 요청만 민감정보 마스킹 해제 (개발 중 디버깅용) */
    allowSensitiveLog?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    /** 요청-응답 시간 측정/추척용 메타데이터 */
    _meta?: {
      startTime: number;
      requestId: string;
    };
  }
}

/* ──────────────────────────────
 * 유틸: ID/마스킹/시리얼라이즈
 * ────────────────────────────── */
const VERBOSE = process.env.DEBUG_VERBOSE === "true";

/** 간단한 요청 ID */
const newRequestId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** AxiosHeaders/기타 값을 안전한 Plain Object로 변환 */
function headersToPlainObject(headers: unknown): Record<string, unknown> {
  if (!headers) return {};
  if (headers instanceof AxiosHeaders) {
    return headers.toJSON() as Record<string, unknown>;
  }
  if (typeof headers === "object" && !Array.isArray(headers)) {
    return headers as Record<string, unknown>;
  }
  return {};
}

/** 민감 헤더 마스킹 (항상 Plain Object에서만 스프레드) */
function maskHeaders(
  headers: unknown,
  allowSensitive = false,
): Record<string, unknown> {
  const plain = headersToPlainObject(headers);
  if (allowSensitive) return plain;

  const clone: Record<string, unknown> = {
    ...(plain as Record<string, unknown>),
  };
  for (const k of Object.keys(clone)) {
    const low = k.toLowerCase();
    if (["authorization", "cookie", "set-cookie", "x-api-key"].includes(low)) {
      const val = String(clone[k] ?? "");
      clone[k] =
        val.length > 12 ? `${val.slice(0, 6)}...${val.slice(-4)}` : "****";
    }
  }
  return clone;
}

/* ──────────────────────────────
 * 타입 가드 & 시리얼라이즈
 * ────────────────────────────── */
type FileLike = { name: string; size: number; type?: string };
type BlobLike = {
  size: number;
  type?: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const isFileLike = (x: unknown): x is FileLike =>
  !!x && typeof x === "object" && "name" in x && "size" in x;

const isBlobLike = (x: unknown): x is BlobLike =>
  !!x &&
  typeof x === "object" &&
  "size" in x &&
  typeof (x as { arrayBuffer?: unknown }).arrayBuffer === "function";

// FormData → 로깅용
async function formDataToDebugArray(fd: FormData) {
  const out: Array<{ key: string; type: string; value: unknown }> = [];

  // ✅ 값(raw)을 unknown으로 받아 우리 타입가드로 직접 좁힘
  for (const [key, raw] of fd.entries()) {
    const v: unknown = raw;

    if (typeof v === "string") {
      out.push({ key, type: "text", value: v });
    } else if (isFileLike(v)) {
      out.push({
        key,
        type: "file",
        value: {
          name: v.name,
          size: v.size,
          mime: v.type ?? "application/octet-stream",
        },
      });
    } else if (isBlobLike(v)) {
      out.push({
        key,
        type: "blob",
        value: { size: v.size, mime: v.type ?? "application/octet-stream" },
      });
    } else {
      out.push({ key, type: typeof v, value: v });
    }
  }

  return out;
}

function isFormData(x: unknown): x is FormData {
  return typeof FormData !== "undefined" && x instanceof FormData;
}

/** 요청 body/params 시리얼라이즈 (FormData/Blob 등 안전 처리) */
async function serializeData(data: unknown): Promise<unknown> {
  if (data == null) return data;
  if (isFormData(data)) return formDataToDebugArray(data);
  if (isBlobLike(data)) {
    return {
      type: "blob",
      size: data.size,
      mime: data.type || "application/octet-stream",
    };
  }
  if (typeof data === "string") return data;
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return String(data);
  }
}

/** 에러 메시지 표준화 */
export function extractAxiosErrorMessage(
  e: unknown,
  fallback = "요청 실패",
): string {
  const ax = e as AxiosError<unknown>;

  const data = ax?.response?.data as unknown;
  if (data && typeof data === "object") {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") return msg;

    const err = (data as { error?: unknown }).error;
    if (typeof err === "string") return err;
  }

  if (ax?.message) return ax.message;
  return fallback;
}

/* ──────────────────────────────
 * Axios 인스턴스
 * ────────────────────────────── */
const restClient = axios.create({
  baseURL: "/api/rest",
  timeout: 10000,
});

/* ──────────────────────────────
 * 요청 인터셉터
 * ────────────────────────────── */
restClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    // 메타데이터 세팅
    config._meta = { startTime: performance.now(), requestId: newRequestId() };

    // baseURL 스위칭 (프록시 우회)
    config.baseURL =
      config.useCors === false
        ? "http://i13e104.p.ssafy.io:8080/api/v1/"
        : "/api/rest";

    // 인증 헤더 세팅
    if (config.requireAuth) {
      const session = await getSession();
      const accessToken = session?.accessToken;

      if (accessToken) {
        // Ensure config.headers is an AxiosHeaders instance
        if (!(config.headers instanceof AxiosHeaders)) {
          // If it's not AxiosHeaders, convert it to AxiosHeaders
          // This handles cases where config.headers might be a plain object or undefined
          config.headers = new AxiosHeaders(config.headers);
        }
        config.headers.set("Authorization", accessToken);
      }
    }

    // 로깅
    if (!config.silentLog) {
      const base = config.baseURL ?? "";
      const path = config.url ?? "";
      const fullUrl = `${base}${path}`;

      const allowSensitive = !!config.allowSensitiveLog;
      const safeHeaders = maskHeaders(config.headers, allowSensitive);

      const payload =
        config.method?.toLowerCase() === "get"
          ? undefined
          : await serializeData(config.data);
      const params = await serializeData(config.params);

      console.groupCollapsed(
        `%c[REST →] ${config._meta.requestId} ${(
          config.method ?? "GET"
        ).toUpperCase()} ${fullUrl}`,
        "color:#0ea5e9",
      );
      console.log(
        "requireAuth:",
        !!config.requireAuth,
        "useCors:",
        config.useCors,
      );
      console.log("headers:", safeHeaders);
      if (params !== undefined) console.log("params:", params);
      if (payload !== undefined) console.log("data:", payload);
      console.groupEnd();
    }

    return config;
  },
);

/* ──────────────────────────────
 * 응답 인터셉터
 * ────────────────────────────── */
restClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const cfg = response.config as InternalAxiosRequestConfig;
    const dur =
      cfg?._meta?.startTime != null
        ? Math.round(performance.now() - cfg._meta.startTime)
        : undefined;

    if (!cfg?.silentLog) {
      const base = cfg.baseURL ?? "";
      const path = cfg.url ?? "";
      const fullUrl = `${base}${path}`;

      const allowSensitive = !!cfg.allowSensitiveLog;
      const safeResHeaders = maskHeaders(response.headers, allowSensitive);

      const preview =
        typeof response.data === "string"
          ? response.data.slice(0, 600)
          : response.data;

      console.groupCollapsed(
        `%c[REST ←] ${cfg?._meta?.requestId ?? "-"} ${response.status} ${fullUrl} ${
          dur ? `(${dur}ms)` : ""
        }`,
        "color:#22c55e",
      );
      console.log("status:", response.status, response.statusText);
      console.log("headers:", safeResHeaders);
      console.log("data:", VERBOSE ? response.data : preview);
      console.groupEnd();
    }

    return response;
  },
  async (error: AxiosError) => {
    const cfg = (error.config ?? {}) as InternalAxiosRequestConfig;
    const dur =
      cfg?._meta?.startTime != null
        ? Math.round(performance.now() - cfg._meta.startTime)
        : undefined;

    const base = cfg.baseURL ?? "";
    const path = cfg.url ?? "";
    const fullUrl = `${base}${path}`;

    const allowSensitive = !!cfg?.allowSensitiveLog;
    const safeReqHeaders = maskHeaders(cfg?.headers, allowSensitive);
    const params = await serializeData(cfg?.params);
    const payload =
      cfg?.method?.toLowerCase() === "get"
        ? undefined
        : await serializeData(cfg?.data);

    const res = error.response;
    const safeResHeaders = res
      ? maskHeaders(res.headers, allowSensitive)
      : null;

    console.groupCollapsed(
      `%c[REST ✖] ${cfg?._meta?.requestId ?? "-"} ${res?.status ?? "ERR"} ${fullUrl} ${
        dur ? `(${dur}ms)` : ""
      }`,
      "color:#ef4444",
    );
    console.log("code:", error.code);
    console.log("message:", error.message);
    console.log("request.headers:", safeReqHeaders);
    if (params !== undefined) console.log("request.params:", params);
    if (payload !== undefined) console.log("request.data:", payload);
    if (res) {
      console.log("response.status:", res.status, res.statusText);
      console.log("response.headers:", safeResHeaders);
      console.log("response.data:", res.data);
    }
    console.groupEnd();

    return Promise.reject(error);
  },
);

export default restClient;

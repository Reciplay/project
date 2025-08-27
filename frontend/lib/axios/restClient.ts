import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signIn, signOut } from "next-auth/react";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
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
// const VERBOSE = process.env.DEBUG_VERBOSE === "true";

/** 간단한 요청 ID */
const newRequestId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** AxiosHeaders/기타 값을 안전한 Plain Object로 변환 */
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

/** 민감 헤더 마스킹 (항상 Plain Object에서만 스프레드) */
// function maskHeaders(
//   headers: unknown,
//   allowSensitive = false,
// ): Record<string, unknown> {
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

/* ──────────────────────────────
 * 타입 가드 & 시리얼라이즈
 * ────────────────────────────── */
// type FileLike = { name: string; size: number; type?: string };
// type BlobLike = {
//   size: number;
//   type?: string;
//   arrayBuffer: () => Promise<ArrayBuffer>;
// };

// const isFileLike = (x: unknown): x is FileLike =>
//   !!x && typeof x === "object" && "name" in x && "size" in x;

// const isBlobLike = (x: unknown): x is BlobLike =>
//   !!x &&
//   typeof x === "object" &&
//   "size" in x &&
//   typeof (x as { arrayBuffer?: unknown }).arrayBuffer === "function";

// FormData → 로깅용
// async function formDataToDebugArray(fd: FormData) {
//   const out: Array<{ key: string; type: string; value: unknown }> = [];

//   // ✅ 값(raw)을 unknown으로 받아 우리 타입가드로 직접 좁힘
//   for (const [key, raw] of fd.entries()) {
//     const v: unknown = raw;

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

// function isFormData(x: unknown): x is FormData {
//   return typeof FormData !== "undefined" && x instanceof FormData;
// }

/** 요청 body/params 시리얼라이즈 (FormData/Blob 등 안전 처리) */
// async function serializeData(data: unknown): Promise<unknown> {
//   if (data == null) return data;
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
const API_BASE_URL = "주소/api/v1"; // 주소 넣으면 됨

const restClient = axios.create({
  baseURL: API_BASE_URL, // 배포 서버
  timeout: 50000,
});

/* ──────────────────────────────
 * 요청 인터셉터
 * ────────────────────────────── */
restClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config._meta = { startTime: performance.now(), requestId: newRequestId() };

    config.baseURL = config.useCors === false ? API_BASE_URL : "/api/rest";

    if (config.requireAuth) {
      const session = await getSession();
      const accessToken = session?.accessToken;

      if (accessToken) {
        if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers);
        }
        config.headers.set("Authorization", accessToken);
      }
    }
    if (config.useCors === false || config.useCors === undefined) {
      // CORS 직접 호출
      config.baseURL = API_BASE_URL;
    } else {
      // 프록시 경유 (Next.js API Route)
      config.baseURL = "/api/rest";
    }

    // logRequest(config);

    return config;
  },
);

/* ──────────────────────────────
 * 응답 인터셉터
 * ────────────────────────────── */
restClient.interceptors.response.use(
  async (response) => {
    // logResponse(response);
    return response;
  },
  async (error: AxiosError) => {
    // logError(error);

    const originalRequest = error.config as RetryableRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const session = await getSession();

      if (session?.refreshToken) {
        try {
          // ✅ GET + refresh-token 헤더
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE}/user/auth/refresh-token`,
            {
              headers: {
                "refresh-token": session.refreshToken,
              },
              withCredentials: true,
            },
          );

          const newAccessToken = res.headers?.authorization;
          if (!newAccessToken) throw new Error("No access token from refresh");

          // ✅ 세션 갱신 (NextAuth)
          await signIn("credentials", {
            redirect: false,
            tokenLogin: "1",
            email: session.user?.email,
            accessToken: newAccessToken,
            refreshToken: session.refreshToken,
            role: session.role,
            required: String(session.required),
          });

          // ✅ 원래 요청 헤더 수정
          if (originalRequest.headers) {
            const headers = originalRequest.headers as AxiosRequestHeaders;
            if ("set" in headers && typeof headers.set === "function") {
              headers.set("Authorization", newAccessToken);
            } else {
              headers.Authorization = newAccessToken;
            }
          }
          console.log("리프레쉬 성공");
          // ✅ 원래 요청 재시도
          return restClient(originalRequest);
        } catch (refreshError) {
          console.error("Session refresh failed:", refreshError);
          signOut();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
// async function logRequest(config: InternalAxiosRequestConfig) {
//   if (config.silentLog) return;

//   const base = config.baseURL ?? "";
//   const path = config.url ?? "";
//   const fullUrl = `${base}${path}`;

//   const allowSensitive = !!config.allowSensitiveLog;
//   const safeHeaders = maskHeaders(config.headers, allowSensitive);

//   const payload =
//     config.method?.toLowerCase() === "get"
//       ? undefined
//       : await serializeData(config.data);
//   const params = await serializeData(config.params);

//   console.groupCollapsed(
//     `%c[REST →] ${config._meta?.requestId ?? "-"} ${(
//       config.method ?? "GET"
//     ).toUpperCase()} ${fullUrl}`,
//     "color:#0ea5e9",
//   );
//   console.log("requireAuth:", !!config.requireAuth, "useCors:", config.useCors);
//   console.log("headers:", safeHeaders);
//   if (params !== undefined) console.log("params:", params);
//   if (payload !== undefined) console.log("data:", payload);
//   console.groupEnd();
// }
// function logResponse(response: AxiosResponse, verbose = VERBOSE) {
//   const cfg = response.config as InternalAxiosRequestConfig;
//   const dur =
//     cfg?._meta?.startTime != null
//       ? Math.round(performance.now() - cfg._meta.startTime)
//       : undefined;

//   if (!cfg?.silentLog) {
//     const base = cfg.baseURL ?? "";
//     const path = cfg.url ?? "";
//     const fullUrl = `${base}${path}`;

//     const allowSensitive = !!cfg.allowSensitiveLog;
//     const safeResHeaders = maskHeaders(response.headers, allowSensitive);

//     const preview =
//       typeof response.data === "string"
//         ? response.data.slice(0, 600)
//         : response.data;

//     console.groupCollapsed(
//       `%c[REST ←] ${cfg?._meta?.requestId ?? "-"} ${response.status} ${fullUrl} ${
//         dur ? `(${dur}ms)` : ""
//       }`,
//       "color:#22c55e",
//     );
//     console.log("status:", response.status, response.statusText);
//     console.log("headers:", safeResHeaders);
//     console.log("data:", verbose ? response.data : preview);
//     console.groupEnd();
//   }
// }

// async function logError(error: AxiosError) {
//   const cfg = (error.config ?? {}) as InternalAxiosRequestConfig;
//   const dur =
//     cfg?._meta?.startTime != null
//       ? Math.round(performance.now() - cfg._meta.startTime)
//       : undefined;

//   const base = cfg.baseURL ?? "";
//   const path = cfg.url ?? "";
//   const fullUrl = `${base}${path}`;

//   const allowSensitive = !!cfg?.allowSensitiveLog;
//   const safeReqHeaders = maskHeaders(cfg?.headers, allowSensitive);
//   const params = await serializeData(cfg?.params);
//   const payload =
//     cfg?.method?.toLowerCase() === "get"
//       ? undefined
//       : await serializeData(cfg?.data);

//   const res = error.response;
//   const safeResHeaders = res ? maskHeaders(res.headers, allowSensitive) : null;

//   console.groupCollapsed(
//     `%c[REST ✖] ${cfg?._meta?.requestId ?? "-"} ${res?.status ?? "ERR"} ${fullUrl} ${
//       dur ? `(${dur}ms)` : ""
//     }`,
//     "color:#ef4444",
//   );
//   console.log("code:", error.code);
//   console.log("message:", error.message);
//   console.log("request.headers:", safeReqHeaders);
//   if (params !== undefined) console.log("request.params:", params);
//   if (payload !== undefined) console.log("request.data:", payload);
//   if (res) {
//     console.log("response.status:", res.status, res.statusText);
//     console.log("response.headers:", safeResHeaders);
//     console.log("response.data:", res.data);
//   }
//   console.groupEnd();
// }
export default restClient;

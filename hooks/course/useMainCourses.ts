// // hooks/course/useMainCourses.ts
// "use client";

// import restClient from "@/lib/axios/restClient";
// import type { PaginationResponse } from "@/types/apiResponse";
// import type { CourseCard } from "@/types/course";

// import type { AxiosError } from "axios";
// import { useSession } from "next-auth/react";
// import qs from "qs";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// type CourseCardCondition = {
//   requestCategory?:
//     | "special"
//     | "soon"
//     | "enrolled"
//     | "search"
//     | "zzim"
//     | "complete"
//     | "instructor";
//   searchContent?: string;
//   instructorId?: number;
//   isEnrolled?: boolean;
// };

// type Pageable = {
//   page?: number; // 0-base
//   size?: number;
//   sort?: string[];
// };

// type SectionState = {
//   list: CourseCard[];
//   totalPages: number;
//   totalElements: number;
//   loading: boolean;
//   message: string | null;
//   refetch: () => Promise<void>;
// };

// type UseMainCoursesOptions = {
//   page?: number; // 1-base
//   size?: number;
//   sort?: string[];
//   specialCond?: CourseCardCondition;
//   soonCond?: CourseCardCondition;
//   enrolledCond?: CourseCardCondition;
// };

// const ENDPOINT = "/course/courses/cards";

// // 서버 스펙: 최상위 쿼리 (requestCategory, page, size, sort...)
// function buildQuery(cond: CourseCardCondition, pageable: Pageable) {
//   return {
//     requestCategory: cond.requestCategory,
//     searchContent: cond.searchContent,
//     instructorId: cond.instructorId,
//     isEnrolled: cond.isEnrolled,
//     page: pageable.page ?? 0,
//     size: pageable.size ?? 12,
//     sort: pageable.sort,
//   };
// }

// const DEFAULT_SPECIAL: Readonly<CourseCardCondition> = Object.freeze({
//   requestCategory: "special",
// });
// const DEFAULT_SOON: Readonly<CourseCardCondition> = Object.freeze({
//   requestCategory: "soon",
// });
// const DEFAULT_ENROLLED: Readonly<CourseCardCondition> = Object.freeze({
//   requestCategory: "enrolled",
// });

// export function useMainCourses(opts: UseMainCoursesOptions = {}) {
//   const {
//     page = 1,
//     size = 12,
//     sort = undefined,
//     specialCond,
//     soonCond,
//     enrolledCond,
//   } = opts;

//   // ✅ 내부에서 로그인 상태 자동 감지
//   const { status } = useSession();
//   const isAuthenticated = status === "authenticated";

//   const page0 = Math.max(0, page - 1);

//   // 조건 머지 (참조 안정화)
//   const mergedSpecial = useMemo(
//     () => ({ ...DEFAULT_SPECIAL, ...(specialCond ?? {}) }),
//     [specialCond]
//   );
//   const mergedSoon = useMemo(
//     () => ({ ...DEFAULT_SOON, ...(soonCond ?? {}) }),
//     [soonCond]
//   );
//   const mergedEnrolled = useMemo(
//     () => ({ ...DEFAULT_ENROLLED, ...(enrolledCond ?? {}) }),
//     [enrolledCond]
//   );

//   const pageableBase: Pageable = useMemo(
//     () => ({ page: page0, size, sort }),
//     [page0, size, sort]
//   );

//   const makeSection = (): Omit<SectionState, "refetch"> => ({
//     list: [],
//     totalPages: 1,
//     totalElements: 0,
//     loading: false,
//     message: null,
//   });

//   const [special, setSpecial] = useState(makeSection);
//   const [soon, setSoon] = useState(makeSection);
//   const [enrolled, setEnrolled] = useState(makeSection);

//   // 섹션별 AbortController
//   const acSpecial = useRef<AbortController | null>(null);
//   const acSoon = useRef<AbortController | null>(null);
//   const acEnrolled = useRef<AbortController | null>(null);

//   // 공용 fetcher (이 훅에서만 qs 직렬화)
//   const fetchCards = useCallback(
//     async (
//       cond: CourseCardCondition,
//       authed: boolean,
//       signal?: AbortSignal
//     ) => {
//       const params = buildQuery(cond, pageableBase);

//       const serialize = (p: Record<string, unknown>) =>
//         qs.stringify(p, {
//           allowDots: true,
//           arrayFormat: "repeat",
//           skipNulls: true,
//           encode: true,
//         });

//       const queryString = serialize(params);
//       const base = (restClient.defaults.baseURL ?? "").replace(/\/+$/, "");
//       const path = ENDPOINT.replace(/^\/+/, "");
//       const finalUrl = `${base ? `${base}/` : "/"}${path}${
//         queryString ? `?${queryString}` : ""
//       }`;

//       console.log("[fetchCards] REQUEST", {
//         authed,
//         category: cond.requestCategory,
//         params,
//         finalUrl,
//       });

//       const res = await restClient.get<PaginationResponse<CourseCard>>(
//         ENDPOINT,
//         {
//           params,
//           paramsSerializer: (p) => serialize(p),
//           requireAuth: authed,
//           signal,
//         }
//       );

//       console.log("[fetchCards] RESPONSE", res.status, res.data);
//       return res;
//     },
//     [pageableBase]
//   );

//   // 공용 로더
//   const loadSection = useCallback(
//     async (
//       setState: React.Dispatch<
//         React.SetStateAction<Omit<SectionState, "refetch">>
//       >,
//       controllerRef: React.MutableRefObject<AbortController | null>,
//       cond: CourseCardCondition,
//       authed: boolean
//     ) => {
//       console.log("[loadSection] 시작", cond.requestCategory, { authed });

//       // 이전 요청 취소
//       controllerRef.current?.abort();
//       controllerRef.current = new AbortController();

//       // enrolled는 인증 필수. 미인증이면 초기화 후 종료
//       if (cond.requestCategory === "enrolled" && !authed) {
//         console.log("[loadSection] 미인증 상태 → enrolled 스킵");
//         setState({
//           list: [],
//           totalPages: 1,
//           totalElements: 0,
//           loading: false,
//           message: null,
//         });
//         return;
//       }

//       try {
//         setState((s) => ({ ...s, loading: true, message: null }));
//         const res = await fetchCards(
//           cond,
//           authed,
//           controllerRef.current.signal
//         );

//         if (res.status === 200) {
//           const d = res.data.data;

//           console.log(res.data.data);
//           setState({
//             list: d.content,
//             totalPages: d.totalPages ?? d.totalPages ?? 1,
//             totalElements: d.totalElements ?? 0,
//             loading: false,
//             message: null,
//           });
//           console.log("[loadSection] 성공", {
//             category: cond.requestCategory,
//             count: d.content?.length,
//             totalPages: d.totalPages,
//           });
//         } else {
//           setState((s) => ({
//             ...s,
//             loading: false,
//             message: res.data?.message ?? "목록을 불러오지 못했어요.",
//           }));
//         }
//       } catch (err) {
//         const error = err as AxiosError;
//         if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED")
//           return;
//         console.error("[loadSection] 오류", {
//           category: cond.requestCategory,
//           status: error?.response?.status,
//           data: error?.response?.data,
//         });
//         const status = error?.response?.status;
//         const msg =
//           status === 403
//             ? "접근 권한이 없습니다. 로그인 상태/권한을 확인해 주세요."
//             : err?.response?.data?.message ?? "네트워크 오류가 발생했습니다.";
//         setState((s) => ({ ...s, loading: false, message: msg }));
//       }
//     },
//     [fetchCards]
//   );

//   // ✅ special/soon은 항상 비인증 호출, enrolled만 로그인 여부 반영
//   const loadSpecial = useCallback(
//     () => loadSection(setSpecial, acSpecial, mergedSpecial, true),
//     [loadSection, mergedSpecial]
//   );
//   const loadSoon = useCallback(
//     () => loadSection(setSoon, acSoon, mergedSoon, true),
//     [loadSection, mergedSoon]
//   );
//   const loadEnrolled = useCallback(
//     () => loadSection(setEnrolled, acEnrolled, mergedEnrolled, isAuthenticated),
//     [loadSection, mergedEnrolled, isAuthenticated]
//   );

//   useEffect(() => {
//     console.log("[useMainCourses] 마운트 / 초기 로딩", {
//       isAuthenticated,
//       status,
//     });
//     loadSpecial();
//     loadSoon();
//     loadEnrolled();
//     return () => {
//       console.log("[useMainCourses] 언마운트 / 요청 취소");
//       acSpecial.current?.abort();
//       acSoon.current?.abort();
//       acEnrolled.current?.abort();
//     };
//   }, [loadSpecial, loadSoon, loadEnrolled, isAuthenticated, status]);

//   const specialRefetch = useCallback(loadSpecial, [loadSpecial]);
//   const soonRefetch = useCallback(loadSoon, [loadSoon]);
//   const enrolledRefetch = useCallback(loadEnrolled, [loadEnrolled]);

//   return {
//     specialCourses: { ...special, refetch: specialRefetch },
//     soonCourses: { ...soon, refetch: soonRefetch },
//     enrolledCourses: { ...enrolled, refetch: enrolledRefetch },
//     refetchAll: async () =>
//       Promise.all([specialRefetch(), soonRefetch(), enrolledRefetch()]),
//     isLoadingAny: special.loading || soon.loading || enrolled.loading,
//   };
// }

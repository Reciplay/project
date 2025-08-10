import restClient from "@/lib/axios/restClient";
import { PaginationResponse } from "@/types/apiResponse";
import { CourseCard } from "@/types/course";
import qs from "qs";

export type CourseCardCondition = {
  requestCategory?:
    | "special"
    | "soon"
    | "enrolled"
    | "search"
    | "zzim"
    | "complete"
    | "instructor";
  searchContent?: string;
  instructorId?: number;
  isEnrolled?: boolean;
};
export type Pageable = { page?: number; size?: number; sort?: string[] };

export const ENDPOINT = "/course/courses/cards";

export const serialize = (p: Record<string, unknown>) =>
  qs.stringify(p, {
    allowDots: true,
    arrayFormat: "repeat",
    skipNulls: true,
    encode: true,
  });

export const buildQuery = (cond: CourseCardCondition, pageable: Pageable) => ({
  requestCategory: cond.requestCategory,
  searchContent: cond.searchContent,
  instructorId: cond.instructorId,
  isEnrolled: cond.isEnrolled,
  page: pageable.page ?? 0,
  size: pageable.size ?? 12,
  sort: pageable.sort,
});

export async function fetchCards(
  params: Record<string, unknown>,
  authed: boolean,
  signal?: AbortSignal
) {
  return restClient.get<PaginationResponse<CourseCard>>(ENDPOINT, {
    params,
    paramsSerializer: (p) => serialize(p as Record<string, unknown>),
    requireAuth: authed,
    signal,
  });
}

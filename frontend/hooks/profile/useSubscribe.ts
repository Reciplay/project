"use client";

import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { message } from "antd";
import { useCallback, useState } from "react";

export function useSubscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const subscribe = useCallback(async (instructorId: number) => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.post<ApiResponse<null>>(
        "/user/subscription",
        null, // POST 요청 본문이 필요 없는 경우 null
        { params: { instructorId }, requireAuth: true },
      );

      if (res.status === 200) {
        message.success(res.data?.message || "강사 구독에 성공했습니다.");
        return true;
      } else {
        const msg = res.data?.message || "강사 구독에 실패했습니다.";
        message.error(msg);
        setError(msg);
        return false;
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "강사 구독 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (instructorId: number) => {
    setLoading(true);
    setError("");

    try {
      const res = await restClient.delete<ApiResponse<null>>(
        "/user/subscription",
        { params: { instructorId }, requireAuth: true },
      );

      if (res.status === 200) {
        message.success(res.data?.message || "강사 구독 취소에 성공했습니다.");
        return true;
      } else {
        const msg = res.data?.message || "강사 구독 취소에 실패했습니다.";
        message.error(msg);
        setError(msg);
        return false;
      }
    } catch (e) {
      const errorMessage = getErrorMessage(
        e,
        "강사 구독 취소 중 오류가 발생했습니다.",
      );
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, unsubscribe, loading, error };
}

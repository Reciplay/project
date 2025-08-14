import { formData } from "@/config/formData";
import restClient from "@/lib/axios/restClient";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";

type CheckResult = {
  ok: boolean;
  message: string;
};

export function useDuplicateCheck(type: "email" | "nickname") {
  const [checkedValue, setCheckedValue] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const latestRef = useRef<string>("");

  /** 서버 중복 확인 (형식/길이 검증 포함) */
  const checkDuplicate = useCallback(
    async (value: string): Promise<CheckResult> => {
      if (!value) {
        return { ok: false, message: "값을 입력해주세요." };
      }

      const rules = formData[type].rules;

      if (rules.pattern && !rules.pattern.value.test(value)) {
        return { ok: false, message: rules.pattern.message };
      }
      if (rules.minLength && value.length < rules.minLength.value) {
        return { ok: false, message: rules.minLength.message };
      }
      if (rules.maxLength && value.length > rules.maxLength.value) {
        return { ok: false, message: rules.maxLength.message };
      }

      try {
        const res = await restClient.get(`/user/auth/dup-${type}`, {
          params: { [type]: value },
        });

        if (res.status === 200) {
          return {
            ok: true,
            message: `사용 가능한 ${type === "email" ? "이메일" : "닉네임"}입니다.`,
          };
        }
        return { ok: false, message: "확인 실패" };
      } catch (error: unknown) {
        // ✅ Axios 에러 가드
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 403) {
            return {
              ok: false,
              message: `이미 사용 중인 ${type === "email" ? "이메일" : "닉네임"}입니다.`,
            };
          }
          // 기타 서버 응답이 있는 경우
          return {
            ok: false,
            message: "서버 오류로 중복 확인에 실패했습니다.",
          };
        }

        // Axios가 아닌 예외
        console.error(`${type} 중복 확인 중 알 수 없는 오류:`, error);
        return {
          ok: false,
          message: "알 수 없는 오류가 발생했습니다.",
        };
      }
    },
    [type],
  );

  /** 디바운스된 중복 확인 (항상 최신 입력만 반영) */
  const debouncedCheck = useMemo(() => {
    const fn = debounce(
      async (raw: string) => {
        const value = raw.trim();

        // 빈 값이면 상태 리셋
        if (!value) {
          setMessage("");
          setCheckedValue("");
          setOk(false);
          return;
        }

        latestRef.current = value;
        const result = await checkDuplicate(value);

        // 응답이 도착했을 때도 최신 입력과 같은지 확인
        if (latestRef.current !== value) return;

        setMessage(result.message);
        setCheckedValue(result.ok ? value : "");
        setOk(result.ok);
      },
      500,
      { trailing: true },
    );

    return fn;
  }, [checkDuplicate]);

  return {
    checkedValue,
    message,
    ok,
    debouncedCheck,
    cancelCheck: debouncedCheck.cancel as () => void,
    flushCheck: debouncedCheck.flush as () => void,
  };
}

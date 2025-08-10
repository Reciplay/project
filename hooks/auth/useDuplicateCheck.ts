import { formData } from "@/config/formData";
import restClient from "@/lib/axios/restClient";
import { debounce } from "lodash";
import { useMemo, useRef, useState } from "react";

type CheckResult = {
  ok: boolean;
  message: string;
};

export function useDuplicateCheck(type: "email" | "nickname") {
  const [checkedValue, setCheckedValue] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const latestRef = useRef<string>("");

  const checkDuplicate = async (value: string): Promise<CheckResult> => {
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
        params: {
          [type]: value,
        },
      });

      if (res.status === 200) {
        return {
          ok: true,
          message: `사용 가능한 ${
            type === "email" ? "이메일" : "닉네임"
          }입니다.`,
        };
      }

      return { ok: false, message: "확인 실패" };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          ok: false,
          message: `이미 사용 중인 ${
            type === "email" ? "이메일" : "닉네임"
          }입니다.`,
        };
      }

      console.error(`${type} 중복 확인 중 오류:`, error);
      return {
        ok: false,
        message: "서버 오류로 중복 확인에 실패했습니다.",
      };
    }
  };

  const debouncedCheck = useMemo(() => {
    const fn = debounce(
      async (raw: string) => {
        const value = raw.trim();

        // 🔒 가드: 빈 값/형식 미달/최소 길이 미만이면 상태 리셋 후 스킵
        if (!value) {
          setMessage("");
          setCheckedValue("");
          setOk(false);
          return;
        }

        latestRef.current = value;
        const result = await checkDuplicate(value);

        // 🔒 레이스 가드: 최신 입력과 응답의 대상이 같을 때만 업데이트
        if (latestRef.current !== value) return;

        setMessage(result.message);
        setCheckedValue(result.ok ? value : "");
        setOk(result.ok);
      },
      500,
      { trailing: true }
    );

    // ✅ blur 시 즉시 실행하고 싶을 때 쓰려고 flush 노출
    fn.flush = fn.flush;
    fn.cancel = fn.cancel;

    return fn;
  }, [type]);

  return {
    checkedValue,
    message,
    ok,
    debouncedCheck,
    cancelCheck: debouncedCheck.cancel as () => void,
    flushCheck: debouncedCheck.flush as () => void, // ⬅️ 추가
  };
}

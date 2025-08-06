// hooks/useDebouncedDuplicateCheck.ts
import { useMemo, useState } from "react";
import { debounce } from "lodash";
import restClient from "@/lib/axios/restClient";
type CheckResult = {
  ok: boolean;
  message: string;
};

export function useDuplicateCheck(type: "email" | "nickname") {
  const [checkedValue, setCheckedValue] = useState("");
  const [message, setMessage] = useState("");

  const checkDuplicate = async (value: string): Promise<CheckResult> => {
    try {
      const res = await restClient.post(`/user/auth/dup-${type}`, {
        [type]: value,
      });

      if (res.status === 200) {
        return {
          ok: true,
          message:
            "사용 가능한 " +
            (type === "email" ? "이메일" : "닉네임") +
            "입니다.",
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
    return debounce(async (value: string) => {
      const result = await checkDuplicate(value);
      setMessage(result.message); // ✅ 사용자 메시지로 UI 피드백 가능
      setCheckedValue(result.ok ? value : "");
    }, 500);
  }, [type]);

  return {
    checkedValue,
    message,
    debouncedCheck,
    cancelCheck: debouncedCheck.cancel,
  };
}

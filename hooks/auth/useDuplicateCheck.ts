import { formData } from "@/config/formData";
import restClient from "@/lib/axios/restClient";
import { debounce } from "lodash";
import { useMemo, useState } from "react";

type CheckResult = {
  ok: boolean;
  message: string;
};

export function useDuplicateCheck(type: "email" | "nickname") {
  const [checkedValue, setCheckedValue] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false); // ✅ 중복 여부 저장

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
    return debounce(async (value: string) => {
      const result = await checkDuplicate(value);
      setMessage(result.message);
      setCheckedValue(result.ok ? value : ""); // ok일 때만 저장
      setOk(result.ok); // ✅ ok 상태 업데이트
    }, 500);
  }, [type]);

  return {
    checkedValue,
    message,
    debouncedCheck,
    cancelCheck: debouncedCheck.cancel,
    ok, // ✅ 추가
  };
}

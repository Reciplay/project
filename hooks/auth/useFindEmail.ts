import restClient from "@/lib/axios/restClient";
import { useState } from "react";

export function useFindEmail() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFindEmail = async () => {
    setError("");
    setEmails([]);

    try {
      const res = await restClient.get("/user/auth/email", {
        params: { name, birthday: birthDate },
      });

      const foundEmails = res.data.data;
      if (!foundEmails || foundEmails.length === 0) {
        setError("해당 정보로 가입된 이메일이 없습니다.");
      } else {
        setEmails(foundEmails);
      }
    } catch (err) {
      console.error(err);
      setError("이메일 조회 중 오류가 발생했습니다.");
    }
  };

  return {
    name,
    setName,
    birthDate,
    setBirthDate,
    emails,
    error,
    handleFindEmail,
  };
}

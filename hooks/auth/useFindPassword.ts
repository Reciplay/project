import restClient from "@/lib/axios/restClient";
import { useState } from "react";

export function useFindPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  const requestOtp = async () => {
    setError("");
    try {
      const res = await restClient.get("/user/auth/mail-otp", {
        params: { email: email.trim() },
      });
      alert("인증번호가 이메일로 전송되었습니다.");
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "인증번호 요청 중 오류가 발생했습니다."
      );
    }
  };

  const verifyOtp = async () => {
    setError("");
    try {
      const res = await restClient.get(
        "/user/auth/mail-verification/password",
        { params: { email, otp } }
      );
      setHash(res.data.data.hash);
      setStep(3);
    } catch {
      setError("인증번호가 일치하지 않습니다.");
    }
  };

  const changePassword = async () => {
    setError("");
    try {
      await restClient.post("/user/auth/password", {
        email,
        newPassword,
        hash,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      window.location.href = "/login";
    } catch {
      setError("비밀번호 변경에 실패했습니다.");
    }
  };

  return {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    error,
    requestOtp,
    verifyOtp,
    changePassword,
  };
}

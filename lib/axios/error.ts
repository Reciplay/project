import axios from "axios";

export function getErrorMessage(e: unknown, fallback = "요청 실패") {
  if (axios.isAxiosError(e)) {
    const msg =
      (e.response?.data as { message?: string } | undefined)?.message ??
      e.message;
    return msg ?? fallback;
  }
  if (e instanceof Error) return e.message ?? fallback;
  return fallback;
}

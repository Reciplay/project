"use client";

import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";

const { RangePicker } = DatePicker;

type Value = { startedAt: string; endedAt: string };

type Props = {
  /** 제어 값 (빈 문자열이면 미선택) */
  value: Value;
  /** 변경 콜백 */
  onChange: (v: Value) => void;

  /** UI 옵션 */
  label?: string;
  disabled?: boolean;
  allowClear?: boolean;
  size?: "small" | "middle" | "large";

  /** 표시 포맷 (RangePicker format) */
  displayFormat?: string; // 기본 "YYYY-MM-DD HH:mm"

  /**
   * 반환 문자열 형식:
   * - "iso": ISO 8601 문자열 (기본)
   * - "format": displayFormat으로 format한 문자열
   */
  returnType?: "iso" | "format";
};

const DEFAULT_FMT = "YYYY-MM-DD HH:mm";

export default function LectureRegisterDatePicker({
  value,
  onChange,
  label,
  disabled = false,
  allowClear = true,
  size = "middle",
  displayFormat = DEFAULT_FMT,
  returnType = "iso",
}: Props) {
  const toDayjs = (s: string | null | undefined): Dayjs | null => {
    if (!s) return null;
    const d = dayjs(s);
    return d.isValid() ? d : null;
  };

  const [start, end] = [toDayjs(value?.startedAt), toDayjs(value?.endedAt)];

  const handleChange = (vals: null | [Dayjs | null, Dayjs | null]) => {
    const [s, e] = vals ?? [null, null];

    const fmt = (d: Dayjs | null) => {
      if (!d) return "";
      if (returnType === "format") return d.format(displayFormat);
      return d.toISOString();
    };

    onChange({
      startedAt: fmt(s),
      endedAt: fmt(e),
    });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>}

      <RangePicker
        value={[start, end]}
        onChange={handleChange}
        showTime={{ format: "HH:mm" }}
        format={displayFormat}
        allowClear={allowClear}
        disabled={disabled}
        size={size}
        style={{ width: "100%" }}
      />
    </div>
  );
}

import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import styles from "./customDatePicker.module.scss";

type Props = {
  value?: string; // YYYY-MM-DD
  onChange?: (val: string) => void; // YYYY-MM-DD
  placeholder?: string;
};

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "생년월일",
}: Props) {
  const handleChange: DatePickerProps["onChange"] = (date: Dayjs | null) => {
    onChange?.(date ? date.format("YYYY-MM-DD") : "");
  };

  return (
    <DatePicker
      value={value ? dayjs(value) : null}
      onChange={handleChange}
      placeholder={placeholder}
      rootClassName={styles.customDatePicker}
      allowClear
      format="YYYY-MM-DD"
      // (선택) 미래 날짜 비활성화
      disabledDate={(current) => !!current && current.isAfter(dayjs(), "day")}
    />
  );
}

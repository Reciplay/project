"use client";
import { useCreateCourseStore } from "@/hooks/course/useCreateCourseStore";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";

const { RangePicker } = DatePicker;
const FMT = "YYYY-MM-DD HH:mm";

// type StartKey = "requestCourseInfo.enrollmentStartDate";
// type EndKey = "requestCourseInfo.enrollmentEndDate";

function toDayjsOrNull(s: string) {
  return s ? dayjs(s, FMT) : null;
}

export default function LectureRegisterDatePicker() {
  const s = useCreateCourseStore(
    (st) => st.values.requestCourseInfo.enrollmentStartDate,
  );
  const e = useCreateCourseStore(
    (st) => st.values.requestCourseInfo.enrollmentEndDate,
  );
  const errStart = useCreateCourseStore(
    (st) => st.errors["requestCourseInfo.enrollmentStartDate"],
  );
  const errEnd = useCreateCourseStore(
    (st) => st.errors["requestCourseInfo.enrollmentEndDate"],
  );
  const setRange = useCreateCourseStore((st) => st.setRange);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600 }}>수강 신청 기간</div>
      <RangePicker
        showTime={{ format: "HH:mm" }}
        format={FMT}
        value={
          [toDayjsOrNull(s), toDayjsOrNull(e)] as [Dayjs | null, Dayjs | null]
        }
        onChange={(vals) => {
          const [start, end] = vals ?? [];
          setRange(start ? start.format(FMT) : "", end ? end.format(FMT) : "");
        }}
      />
      {(errStart || errEnd) && (
        <p style={{ color: "red", marginTop: 4 }}>{errStart || errEnd}</p>
      )}
    </div>
  );
}

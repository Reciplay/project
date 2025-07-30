import { forwardRef } from "react";
import styles from "./schedule.module.scss";
import Calendar from "@/components/calendar/calendar";

const Schedule = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.section} ref={ref}>
      <h2>강의 시간표</h2>
      <Calendar />
    </div>
  );
});

Schedule.displayName = "Schedule";
export default Schedule;

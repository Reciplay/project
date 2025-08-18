import Calendar from "@/components/calendar/calendar";
import { LectureSummary } from "@/types/lecture";
import styles from "./schedule.module.scss";

interface ScheduleProps {
  lectures: LectureSummary[];
}

export default function Schedule({ lectures }: ScheduleProps) {
  return (
    <div className={styles.section}>
      <h2>강의 시간표</h2>
      <Calendar lectures={lectures} />
    </div>
  );
}

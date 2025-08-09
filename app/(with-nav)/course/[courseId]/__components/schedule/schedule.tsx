import Calendar from "@/components/calendar/calendar";
import { CourseDetail } from "@/types/course";
import styles from "./schedule.module.scss";

interface ScheduleProps {
  courseDetail: CourseDetail;
}

export default function Schedule({ courseDetail }: ScheduleProps) {
  return (
    <div className={styles.section}>
      <h2>강의 시간표</h2>
      <Calendar lectures={courseDetail.lectureSummaryList} />
    </div>
  );
}

import Calendar from "@/components/calendar/calendar";
import styles from "../page.module.scss";

export default function DashboardCalendar() {
  return (
    <>
      <div className={`${styles.card} ${styles.calendarCard}`}>
        <Calendar lectures={[]} />
      </div>
    </>
  );
}

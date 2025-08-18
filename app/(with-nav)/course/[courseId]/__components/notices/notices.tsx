import { CourseDetail } from "@/types/course";
import styles from "./notices.module.scss";

interface NoticesProps {
  courseDetail: CourseDetail;
}

export default function Notices({ courseDetail }: NoticesProps) {
  return (
    <div className={styles.section}>
      <h2>공지사항</h2>
      <p className={styles.announcement}>{courseDetail.announcement}</p>
    </div>
  );
}

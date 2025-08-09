import { Career } from "@/types/instructor";
import { forwardRef } from "react";
import styles from "../common.module.scss";
interface CareerProps {
  careers: Career[];
}

const Careers = forwardRef<HTMLDivElement, CareerProps>(({ careers }, ref) => {
  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.title}>경력</div>

      <div className={styles.grid}>
        {careers.map((career, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.company}>{career.companyName}</div>
            <div className={styles.position}>{career.position}</div>
            <div className={styles.date}>
              {career.startDate} ~ {career.endDate}
            </div>
            <div className={styles.description}>{career.jobDescription}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

Careers.displayName = "Careers";

export default Careers;

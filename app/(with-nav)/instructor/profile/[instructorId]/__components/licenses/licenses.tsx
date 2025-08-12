import { License } from "@/types/instructor";
import { forwardRef } from "react";
import styles from "../common.module.scss";
interface LicensesProps {
  licenses: License[];
}

const Licenses = forwardRef<HTMLDivElement, LicensesProps>(
  ({ licenses }, ref) => {
    return (
      <div ref={ref} className={styles.container}>
        <div className={styles.title}>자격증</div>
        <div className={styles.grid}>
          {licenses.map((license) => (
            <div className={styles.card} key={license.id}>
              <div className={styles.licenseName}>{license.licenseName}</div>
              <div className={styles.institution}>{license.institution}</div>
              <div className={styles.date}>{license.acquisitionDate}</div>
              <div className={styles.grade}>등급: {license.grade}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Licenses.displayName = "Licenses";
export default Licenses;

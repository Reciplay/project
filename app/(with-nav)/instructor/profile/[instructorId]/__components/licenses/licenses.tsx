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
        {licenses.length == 0 ? (
          <div className={styles.emptyMessage}>취득하신 자격증이 없습니다.</div>
        ) : (
          <div className={styles.grid}>
            {licenses.map((license, index) => (
              <div className={styles.card} key={`${license.id}-${index}`}>
                <div className={styles.licenseName}>{license.licenseName}</div>
                <div className={styles.institution}>{license.institution}</div>
                <div className={styles.date}>{license.acquisitionDate}</div>
                <div className={styles.grade}>등급: {license.grade}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Licenses.displayName = "Licenses";
export default Licenses;

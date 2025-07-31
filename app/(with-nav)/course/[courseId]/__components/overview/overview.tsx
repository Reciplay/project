import { forwardRef } from "react";
import styles from "./overview.module.scss";

const Overview = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.section} ref={ref}>
      <h2>강의상세</h2>
      {/* 내용 */}
    </div>
  );
});

Overview.displayName = "Overview";
export default Overview;

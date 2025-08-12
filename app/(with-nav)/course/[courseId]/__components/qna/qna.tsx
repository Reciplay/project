import { forwardRef } from "react";
import styles from "./qna.module.scss";

const QnA = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.section} ref={ref}>
      <h2>Q & A</h2>
      {/* 내용 */}
    </div>
  );
});

QnA.displayName = "QnA";
export default QnA;

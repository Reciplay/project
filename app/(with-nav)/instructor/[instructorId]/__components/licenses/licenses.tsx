import { License } from "@/types/instructor";
import { forwardRef } from "react";
import styles from "./licenses.module.scss";
interface LicensesProps {
  props: License[];
}

const Licenses = forwardRef<HTMLDivElement, LicensesProps>(({ props }, ref) => {
  return (
    <div ref={ref}>
      <div className={styles.title}>자격증</div>
      <ul className={styles.list}>
        {props.map((item, index) => (
          <li key={index}>{item.licenseName}</li>
        ))}
      </ul>
    </div>
  );
});

Licenses.displayName = "Licenses";
export default Licenses;

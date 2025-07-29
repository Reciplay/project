import { Career } from "@/types/instructor";
import { forwardRef } from "react";
import styles from "./career.module.scss";
interface CareerProps {
  props: Career[];
}

const Careers = forwardRef<HTMLDivElement, CareerProps>(({ props }, ref) => {
  return (
    <div ref={ref}>
      <div className={styles.title}>경력</div>
      <ul className={styles.list}>
        {props.map((item, index) => (
          <li key={index}>{item.companyName}</li>
        ))}
      </ul>
    </div>
  );
});

Careers.displayName = "Careers";
export default Careers;

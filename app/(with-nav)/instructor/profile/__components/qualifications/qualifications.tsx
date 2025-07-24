import { forwardRef } from "react";
interface QualificationsProps {
  items: string[];
}

const Qualifications = forwardRef<HTMLDivElement, QualificationsProps>(
  ({ items }, ref) => {
    return (
      <div ref={ref}>
        <h2>자격증</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
);

Qualifications.displayName = "Qualifications";
export default Qualifications;

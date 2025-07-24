import { forwardRef } from "react";

interface CareerProps {
  items: string[];
}

const Career = forwardRef<HTMLDivElement, CareerProps>(({ items }, ref) => {
  return (
    <div ref={ref}>
      <h2>경력</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
});

Career.displayName = "Career";
export default Career;

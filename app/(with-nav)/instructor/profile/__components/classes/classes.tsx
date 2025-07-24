import ListCard from "@/components/card/listCard";
import { forwardRef } from "react";

const Classes = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <h2>진행 중인 강좌</h2>
      <div>
        <ListCard />
      </div>
      <h2>종료된 강좌</h2>
    </div>
  );
});

Classes.displayName = "Classes";
export default Classes;

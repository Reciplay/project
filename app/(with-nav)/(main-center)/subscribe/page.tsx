import { sampleInstructors } from "@/config/sampleData";
import MonthPicker from "../../../../components/calendar/monthDatePicker";
import SubscribeGrid from "./__components/subscribeGrid/subscribeGrid";

export default function Page() {
  return (
    <div>
      <SubscribeGrid instructors={sampleInstructors} type="구독 중인 목록" />
    </div>
  );
}

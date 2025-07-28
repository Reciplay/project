import { sampleInstructors } from "@/config/sampleData";
import MonthPicker from "../../../../components/calendar/monthDatePicker";
import SubscribeLine from "./__components/subscribeLine/subscribeLine";

export default function Page() {
  return (
    <div>
      <SubscribeLine instructors={sampleInstructors} type="구독중인 목록" />
      <SubscribeLine instructors={sampleInstructors} type="한식" />
      <SubscribeLine instructors={sampleInstructors} type="중식" />
      <SubscribeLine instructors={sampleInstructors} type="일식" />
    </div>
  );
}

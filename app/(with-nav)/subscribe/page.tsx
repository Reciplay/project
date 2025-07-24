import MonthPicker from "../../../components/calendar/monthDatePicker";

// import SubscribeLine from "./__components/subscribeLine/subscribeLine";
const sampleInstructors = [
  {
    id: "1",
    name: "김도윤",
    image: "/images/kdoyoon.jpg",
    subscribers: 210000,
  },
  {
    id: "2",
    name: "김승민",
    image: "/images/kseungmin.jpg",
    subscribers: 210000,
  },
  // ...
];
export default function Page() {
  return (
    <div>
      <MonthPicker />
    </div>
  );
}

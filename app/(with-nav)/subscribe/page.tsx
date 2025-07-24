import MonthPicker from "../../../components/calendar/monthDatePicker";
import SubscribeLine from "./__components/subscribeLine/subscribeLine";

// import SubscribeLine from "./__components/subscribeLine/subscribeLine";
const sampleInstructors = [
  {
    id: "1",
    name: "김도윤",
    image: "/images/김도윤.webp",
    subscribers: 210000,
  },
  {
    id: "2",
    name: "김승민",
    image: "/images/김승민.webp",
    subscribers: 210000,
  },
  {
    id: "3",
    name: "남정석",
    image: "/images/남정석.webp",
    subscribers: 210000,
  },
  {
    id: "4",
    name: "박준우",
    image: "/images/박준우.webp",
    subscribers: 210000,
  },
  {
    id: "5",
    name: "방기수",
    image: "/images/방기수.webp",
    subscribers: 210000,
  },
  // ...
];
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

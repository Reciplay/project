import SegmentedToggle from "@/components/tab/segmentedToggle";
import VerticalTab from "@/components/tab/verticalTab";
import {
  sampleCourse1,
  sampleCourse2,
  sampleCourse3,
} from "@/config/sampleCourse";

function RecruitingCourses() {
  return <div>📢 현재 모집중인 강의 목록</div>;
}

function UpcomingCourses() {
  return <div>📅 곧 개강 예정인 강의 목록</div>;
}

function EndedCourses() {
  return <div>📕 종료된 강의 목록</div>;
}

export default function Page() {
  return (
    <div>
      <SegmentedToggle
        options={["모집중", "예정", "종료"]}
        contents={[
          <VerticalTab course={sampleCourse1} key="recruiting" />,
          <VerticalTab course={sampleCourse2} key="upcoming" />,
          <VerticalTab course={sampleCourse3} key="ended" />,
        ]}
      />
    </div>
  );
}

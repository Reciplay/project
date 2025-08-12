"use client";

import CustomDropdown from "@/components/dropdown/customDropdown";
import SegmentedToggle from "@/components/tab/segmentedToggle";
import VerticalTab from "@/components/tab/verticalTab";
import {
  Course,
  sampleCourse1,
  sampleCourse2,
  sampleCourse3,
} from "@/config/sampleCourse";
import CourseTable from "./__components/courseTable";

export default function Page() {
  const getKey = (item: Course) => item.key;
  const getLabel = (item: Course) => item.label;

  const renderContent = (item: Course) => (
    <div>
      <h2>강좌 명</h2>
      <p>{item.label}</p>

      <h2>강좌 분야</h2>
      <CustomDropdown onChange={() => {}} options={[]} />
      <p>{item.category}</p>

      <h2>강좌 소개</h2>
      <p>{item.introduce}</p>

      <h2>강좌 요약</h2>
      <p>{item.bio}</p>

      <CourseTable />
    </div>
  );

  return (
    <div>
      <SegmentedToggle
        options={["모집중", "예정", "종료"]}
        contents={[
          <VerticalTab
            data={sampleCourse1}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
            key="recruiting"
          />,
          <VerticalTab
            data={sampleCourse2}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
            key="upcoming"
          />,
          <VerticalTab
            data={sampleCourse3}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
            key="ended"
          />,
        ]}
      />
    </div>
  );
}

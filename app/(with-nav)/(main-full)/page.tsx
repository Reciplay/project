import styles from "./page.module.scss";
import Card from "@/components/card/card";
import { sampleCourse1, sampleCourse2 } from "@/config/sampleCourse";
import { CARDTYPE } from "@/types/card";
import SpecialCourse from "./__components/specialCourse";
import Sliding from "./__components/sliding";

export default function Page() {
  // const sampleCourse1: Course = sampleCourse1;
  return (
    <>
      <SpecialCourse />

      <Sliding
        props={{
          section: "수강중인 강좌",
          items: sampleCourse1,
        }}
      />
      <Sliding
        props={{
          section: "개설 예정 강좌",
          items: sampleCourse2,
        }}
      />
    </>
  );
}

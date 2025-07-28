import BaseInput from "@/components/input/baseInput";
import styles from "./page.module.scss";
import NavBar from "@/components/nav/navBar";
import Carousel from "@/components/carousel/carousel";
import { Course } from "@/types/course";
import Card from "@/components/card/card";
import { sampleCourse1 } from "@/config/sampleCourse";
import { CARDTYPE } from "@/types/card";

export default function Page() {
  // const sampleCourse1: Course = sampleCourse1;
  return (
    <>
      <Carousel />

      <div className={styles.slide}>
        {sampleCourse1.map((course, index) => (
          <Card key={index} data={course} type={CARDTYPE.VERTICAL} />
        ))}
      </div>
    </>
  );
}

"use client";

import { useRef } from "react";
import Card from "@/components/card/card";
import styles from "./cardWrapper.module.scss";
import { CARDTYPE } from "@/types/card";
import { sampleCourse1 } from "@/config/sampleCourse";
import Sliding from "./sliding";

export default function CardWrapper() {
  return (
    <div className={styles.cardWrapper}>
      {sampleCourse1.map((course) => (
        <Card key={course.id} data={course} type={CARDTYPE.VERTICAL} />
      ))}
    </div>
  );
}

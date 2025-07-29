import Image from "next/image";
import styles from "./page.module.scss";
import ListCard from "@/components/card/listCard";
// import Card from "@/components/card/card";
import { sampleCourse1 } from "@/config/sampleCourse";
import { CARDTYPE } from "@/types/card";
import Card from "@/components/card/listCard";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.slide}>
        {sampleCourse1.map((course, index) => (
          <ListCard key={index} data={course} variant="horizontal" />
          // <Card key={index} data={course} type={CARDTYPE.HORIZONTAL} />
        ))}
      </div>
    </div>
  );
}

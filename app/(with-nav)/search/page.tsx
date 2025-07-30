import ListCard from "@/components/card/listCard";
import styles from "./page.module.scss";
// import Card from "@/components/card/card";
import { sampleCourse1 } from "@/config/sampleCourse";

export default function Page() {
  return (
    <div className={styles.container}>
      {sampleCourse1.map((course, index) => (
        <ListCard key={index} data={course} variant="horizontal" />
        // <Card key={index} data={course} type={CARDTYPE.HORIZONTAL} />
      ))}
    </div>
  );
}

import { sampleInstructors } from "@/config/sampleData";
import SubscribeGrid from "./__components/subscribeGrid/subscribeGrid";
import styles from "./page.module.scss";
export default function Page() {
  return (
    <div className={styles.container}>
      <SubscribeGrid instructors={sampleInstructors} type="구독 중인 목록" />
    </div>
  );
}

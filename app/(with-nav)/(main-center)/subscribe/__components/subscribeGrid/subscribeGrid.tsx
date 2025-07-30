import BaseButton from "@/components/button/baseButton";
import CircleAvatar from "@/components/image/circleAvatar";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import styles from "./subscribeGrid.module.scss";
import { Instructor } from "@/types/instructor";

interface SubscribeGridProps {
  type: string;
  instructors: Instructor[];
}

export default function SubscribeGrid({
  type,
  instructors,
}: SubscribeGridProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{type}</div>
      <div className={styles.items}>
        {instructors.map((ins) => (
          <Link href={ROUTES.INSTRUCTOR_PROFILE(Number(ins.id))} key={ins.id}>
            <div className={styles.item}>
              <CircleAvatar alt={ins.name} src={ins.profileImage} />
              <div className={styles.name}>{ins.name}</div>
              <div className={styles.subscribeNum}>
                구독자 수 {Math.floor(ins.subscriberCount / 10000)}만 명
              </div>
              <BaseButton title="구독" color="black" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

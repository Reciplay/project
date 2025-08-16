import BaseButton from "@/components/button/baseButton";
import CircleAvatar from "@/components/image/circleAvatar";
import { ROUTES } from "@/config/routes";
import { SubscribedInstructor } from "@/hooks/profile/useSubscribedInstructors";
import Link from "next/link";
import styles from "./subscribeGrid.module.scss";

interface SubscribeGridProps {
  type: string;
  instructors: SubscribedInstructor[];
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
          <Link href={ROUTES.INSTRUCTOR.PROFILE(String(1))} key={1}>
            <div className={styles.item}>
              <CircleAvatar
                alt={ins.instructorProfileFileInfo?.name ?? ""}
                src={ins.instructorProfileFileInfo?.presignedUrl}
              />
              <div className={styles.name}>{ins.instructorName}</div>
              <div className={styles.subscribeNum}>
                구독자 수 {ins.subscriberCount} 명
              </div>
              <BaseButton title="구독" color="black" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

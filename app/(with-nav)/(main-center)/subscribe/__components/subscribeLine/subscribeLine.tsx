import { Instructor } from "@/app/(with-nav)/(main-center)/instructor/[instructorId]/profile/__components/bannerProfile/bannerProfile";
import BaseButton from "@/components/button/baseButton";
import CircleAvatar from "@/components/image/circleAvatar";
import { ROUTES } from "@/config/routes";
import Link from "next/link";
import styles from "./subscribeLine.module.scss";

interface SubscribeLineProps {
  type: string;
  instructors: Instructor[];
}

export default function SubscribeLine({
  type,
  instructors,
}: SubscribeLineProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.type}>{type}</h2>
      <div className={styles.items}>
        {instructors.map((ins) => (
          <Link href={ROUTES.INSTRUCTOR_PROFILE(ins.id)} key={ins.id}>
            <div className={styles.item}>
              <CircleAvatar alt={ins.name} src={ins.thumbnail} />
              <div className={styles.name}>{ins.name}</div>
              <div className={styles.subscribeNum}>
                구독자 수 {Math.floor(ins.subscribers / 10000)}만 명
              </div>
              <BaseButton title="구독" color="black" />
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.more}>더보기</div>
      <hr className={styles.line} />
    </div>
  );
}

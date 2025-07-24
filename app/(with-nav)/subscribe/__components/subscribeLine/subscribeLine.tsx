import Image from "next/image";
import styles from "./subscribeLine.module.scss";
import BaseButton from "@/components/button/baseButton";

interface Instructor {
  id: string;
  name: string;
  image: string;
  subscribers: number;
}

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
          <div key={ins.id} className={styles.item}>
            <div className={styles.imageWrapper}>
              <Image className={styles.image} alt="" src={ins.image} fill />
            </div>
            <div className={styles.name}>{ins.name}</div>
            <div className={styles.subscribeNum}>
              구독자 수 {Math.floor(ins.subscribers / 10000)}만 명
            </div>
            <BaseButton title="구독" color="black" />
          </div>
        ))}
      </div>
      <div className={styles.more}>더보기</div>
      <hr className={styles.line} />
    </div>
  );
}

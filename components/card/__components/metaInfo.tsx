import Dot from "./dot";
import styles from "./metaInfo.module.scss";

interface MetaInfoProps {
  props: {
    instructorName: string;
    isLive: boolean;
    viewerCount: number;
  };
}

export default function MetaInfo({ props }: MetaInfoProps) {
  return (
    <div className={styles.meta}>
      <span className={styles.instructor}>{props.instructorName}</span>
      <Dot />
      <span
        className={`${styles.live} ${props.isLive ? styles.on : styles.off}`}
      >
        Live
      </span>
      <Dot />
      <span className={styles.viewer}>{props.viewerCount} / 50</span>
    </div>
  );
}

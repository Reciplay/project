import Image from "next/image";
import styles from "./circleAvatar.module.scss";

interface CircleAvatarProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function CircleAvatar({
  src,
  alt,
  width = 175,
  height = 175,
}: CircleAvatarProps) {
  return (
    <div className={styles.avatar} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 120px, 175px"
        className={styles.img}
        priority={false}
      />
    </div>
  );
}

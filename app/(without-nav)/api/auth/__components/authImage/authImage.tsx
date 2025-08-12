import Image from "next/image";
import styles from "./authImage.module.scss";

export default function AuthImage() {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src="/images/auth-image.jpg"
        alt="Reciplay"
        fill
        className={styles.image}
      />
    </div>
  );
}

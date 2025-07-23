import Image from "next/image";
import styles from "./page.module.scss";
import BaseButton from "@/components/button/baseButton";
import BaseInput from "@/components/input/baseInput";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* left */}
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/auth-image.jpg"
              alt="Reciplay"
              fill
              className={styles.image}
            />
          </div>
        </div>
        {/* right */}
        <div className={styles.right}>
          <h1 className={styles.logo}>Reciplay</h1>
          <p className={styles.tagline}>추가 정보만 입력하고 시작하세요!</p>

          <form className={styles.form}>
            <BaseInput placeholder="이름" type="name" />
            <BaseInput placeholder="생년월일" type="birth" />
            <BaseInput placeholder="성별" type="sex" />
            <BaseInput placeholder="직업" type="job" />
            <BaseInput placeholder="원하는 강의 카테고리" type="category" />

            <BaseButton title="시작하기" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

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
          <p className={styles.tagline}>
            지금 가입하고 자유로운 학습을 경험하세요!
          </p>

          <form className={styles.form}>
            <BaseInput placeholder="닉네임" type="normal" />
            <BaseInput placeholder="이메일" type="email" />
            <BaseInput placeholder="인증번호" type="confirmEmail" />
            <BaseInput placeholder="비밀번호" type="password" />
            <BaseInput placeholder="비밀번호 확인" type="confirmPassword" />

            <BaseButton title="다음" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

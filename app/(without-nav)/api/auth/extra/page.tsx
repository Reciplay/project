import Image from "next/image";
import styles from "./page.module.scss";
import BaseButton from "@/components/button/baseButton";
import BaseInput from "@/components/input/baseInput";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";

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
          <LogoWIthDesc props={{ desc: "추가 정보만 입력하고 시작하세요!" }} />

          <form className={styles.form}>
            <BaseInput placeholder="이름" type="name" />
            <BaseInput placeholder="생년월일" type="birth" />
            <BaseInput placeholder="성별" type="sex" />
            <BaseInput placeholder="직업" type="job" />
            <BaseInput placeholder="닉네임" type="normal" />
            <BaseButton
              title="시작하기"
              type="submit"
              className={styles.button}
              size="inf"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

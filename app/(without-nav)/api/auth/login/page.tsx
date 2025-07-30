import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import BaseInput from "@/components/input/baseInput";
import BaseButton from "@/components/button/baseButton";
import LogoWIthDesc from "../__components/logoWithDesc/logoWithDesc";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left section */}
        <div className={styles.left}>
          <LogoWIthDesc props={{ desc: "자유롭게 배우는 우리" }} />

          <form className={styles.form}>
            <BaseInput placeholder="이메일" type="email" />
            <BaseInput placeholder="비밀번호" type="password" />
            <BaseButton
              title="로그인"
              type="submit"
              size="inf"
              className={styles.button}
            />
          </form>

          <div className={styles.links}>
            <a href="#">아이디 찾기</a>
            <span> | </span>
            <a href="#">비밀번호 찾기</a>
            <span> | </span>
            <Link href="/api/auth/signup">회원가입</Link>
          </div>

          <Separator />
          <SNS props={{ isLogin: true }} />
        </div>

        {/* Right section */}
        <div className={styles.right}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/auth-image.jpg"
              alt="Reciplay"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

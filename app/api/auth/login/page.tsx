import Image from "next/image";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* left */}
        <div className={styles.left}>
          <h1 className={styles.logo}>Reciplay</h1>
          <p className={styles.tagline}>자유롭게 배우는 우리</p>

          <form className={styles.form}>
            <input type="email" placeholder="이메일" className={styles.input} />
            <input
              type="password"
              placeholder="비밀번호"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              로그인
            </button>
          </form>

          <div className={styles.links}>
            <a href="#">아이디 찾기</a>
            <span> | </span>
            <a href="#">비밀번호 찾기</a>
            <span> | </span>
            <a href="#">회원가입</a>
          </div>

          <div className={styles.separator}>
            <span className={styles.line} />
            <span className={styles.or}>or</span>
            <span className={styles.line} />
          </div>
          <p className={styles.tagline}>SNS 계정으로 간편 로그인</p>
          <div className={styles.snsIcons}>
            <a href="#">
              <Image
                src="/icons/apple.svg"
                alt="Apple"
                width={28}
                height={28}
              />
            </a>
            <a href="#">
              <Image
                src="/icons/google.svg"
                alt="Google"
                width={28}
                height={28}
              />
            </a>
            <a href="#">
              <Image
                src="/icons/kakao.svg"
                alt="Kakao"
                width={28}
                height={28}
              />
            </a>
          </div>
        </div>

        {/* right */}
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

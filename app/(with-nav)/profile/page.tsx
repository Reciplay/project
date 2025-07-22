import Image from "next/image";
import styles from "./page.module.scss";

export default function page() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>내 프로필</div>
      <div className={styles.top}>
        <div className={styles.profileWrapper}>
          <Image
            className={styles.image}
            src="/images/profile.jpg"
            alt="profile"
            fill
          />
        </div>
        <div className={styles.summary}>
          <div className={styles.subtitle}>
            <div>지억</div>
            <div className={styles.svgWrapper}>
              <Image
                className={styles.image}
                src="/icons/badge.svg"
                alt="badge"
                fill
              />
            </div>
          </div>
          <div className={styles.desc}>
            @jixxk • 구독자 1.29천명 • 강의 수 10개
          </div>
          <div className={styles.bio}>
            정성과 풍미를 담아내는 한식의 장인입니다!
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.subtitle}>개인 정보</div>
        <div className={styles.box}>
          <div className={styles.item}>
            <div className={styles.type}>이름</div>
            <div className={styles.value}>이지언</div>
          </div>
          <div className={styles.item}>
            <div className={styles.type}>직업</div>
            <div className={styles.value}>얼리 어답터, C신</div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import styles from "./page.module.scss";
import IconWithText from "@/components/text/iconWithText";
import BaseButton from "@/components/button/baseButton";
import ProgressPieChart from "@/components/chart/progressPieChart";
import ScrollTabs from "./scrollTabs";

export default function page() {
  return (
    <>
      <div className={styles.summary}>
        <div className={styles.left}>
          <div className={styles.category}>요리 / 양식</div>
          <div className={styles.title}>
            이탈리아 현지 미슐랭 요리사에게 배우는 파스타, 뇨끼, 리조또! 프리미
            피아띠 정복하기
          </div>
          <div className={styles.desc}>
            안녕하세요, 유튜브 채널을 운영하며 김밀란 파스타, 리조또 2권의 책을
            낸 요리사 김밀란입니다. 이번 클래스에서는 한국에서 쉽게 구할 수 있는
            재료를 이용해 하나의 양식 코스요리를 완성해 볼 예정입니다.
          </div>
          <div className={styles.rating}>
            ★★★★★ 5.0 수강평 350개 수강생 465명
          </div>
          <div className={styles.author}>
            <IconWithText iconName="user" title="김밀란" />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.imageWrapper}>
            <Image
              className={styles.thumbnail}
              src="/images/food1.jpg"
              fill
              alt="thumbnail"
            />
          </div>
        </div>
      </div>

      <div className={styles.review}>
        <div className={styles.reviewBox}>
          <div className={styles.reviewTitle}>수강평을 남겨주세요!</div>
          <div className={styles.reviewDesc}>
            여러분의 소중한 수강평이 다른 학습자들에게 큰 도움이 됩니다. <br />{" "}
            간단한 피드백을 남겨주세요.
          </div>
        </div>
        {/* <BaseButton title="수강평 남기기" type="" color="red" /> */}
      </div>

      <div className={styles.status}>
        <div className={styles.left}>
          <div className={styles.title}>나의 학습 현황</div>
          <div className={styles.content}>
            <div className={styles.center}>
              <ProgressPieChart pathColor="#14ae5c" />
              <div>오늘의 학습량</div>
            </div>
            <div className={styles.center}>
              <ProgressPieChart pathColor="#007aff" />
              <div>총 학습량</div>
            </div>
          </div>
        </div>
      </div>
      <ScrollTabs />
    </>
  );
}

import BaseButton from "@/components/button/baseButton";
import styles from "./reviewPrompt.module.scss";

interface ReviewPromptProps {
  onClickReviewButton: () => void;
}

export default function ReviewPrompt({
  onClickReviewButton,
}: ReviewPromptProps) {
  return (
    <div className={styles.review}>
      <div className={styles.reviewBox}>
        <div className={styles.reviewTitle}>수강평을 남겨주세요!</div>
        <div className={styles.reviewDesc}>
          여러분의 소중한 수강평이 다른 학습자들에게 큰 도움이 됩니다. <br />
          간단한 피드백을 남겨주세요.
        </div>
      </div>
      <BaseButton
        title="수강평 남기기"
        color="black"
        onClick={onClickReviewButton}
      />
    </div>
  );
}

import CustomButton from "@/components/button/customButton";
import CircleAvatar from "@/components/image/circleAvatar";
import { useSubscribe } from "@/hooks/profile/useSubscribe";
import { useState } from "react";
import styles from "./bannerProfile.module.scss";

interface BannerProfileProps {
  props: {
    profile: string;
    name: string;
    jobDescription: string;
    companyName: string;
    instructorId: number; // Added
    isSubscribed: boolean; // Added
  };
}

export default function BannerProfile({ props }: BannerProfileProps) {
  const { instructorId, isSubscribed } = props; // Destructure instructorId and isSubscribed
  const { subscribe, unsubscribe, loading } = useSubscribe();
  const [currentIsSubscribed, setCurrentIsSubscribed] = useState(isSubscribed);

  const handleSubscribe = async () => {
    const success = await subscribe(instructorId);
    if (success) {
      setCurrentIsSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe(instructorId);
    if (success) {
      setCurrentIsSubscribed(false);
    }
  };

  return (
    <div className={styles.container}>
      <CircleAvatar src={props.profile} alt="강사" />
      <div className={styles.textBox}>
        <div className={styles.name}>{props.name}</div>
        <div className={styles.job}>{props.jobDescription}</div>
        <div className={styles.job}>{props.companyName}</div>

        <div className={styles.buttonContainer}>
          {" "}
          {/* Added container for buttons */}
          {!currentIsSubscribed ? (
            <CustomButton
              title="구독"
              variant="custom"
              size="md"
              onClick={handleSubscribe}
              disabled={loading}
            />
          ) : (
            <CustomButton
              title="구독 취소"
              variant="custom"
              size="md"
              onClick={handleUnsubscribe}
              disabled={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

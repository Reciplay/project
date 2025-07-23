import Image from "next/image";
import styles from "./page.module.scss";
import classNames from "classnames";
import IconWithText from "@/components/text/iconWithText";
import Introduction from "./__components/introduction";
import Certificate from "./__components/certificate";

export default function page() {
	return (
		<div>
			<div className={styles.frame}>
				<div className={styles.textContainer}>
					<span className={styles.name}>이지언</span>
					<span>여 2000 (25세)</span>
					<div className={styles.innerText}>
						<IconWithText
							iconName="email"
							title="ssafyjoa@exmple.com"
						/>
						<IconWithText
							iconName="user2"
							title="양식 강사"
						/>
					</div>
					<IconWithText
						iconName="address"
						title="부산 강서구 명지국제6로 107 부산명지 대방디엠시티 센텀오션 2차"
					/>
				</div>
				<div className={styles.imageWrapper}>
					<Image src="/images/profile2.jpg" fill alt="profile" style={{ objectFit: 'cover' }} />
				</div>
			</div>
			<Introduction></Introduction>
			<Certificate></Certificate>
		</div>
	)
}
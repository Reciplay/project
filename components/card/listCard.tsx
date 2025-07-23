import Image from "next/image";
import styles from "./listCard.module.scss";
import classNames from "classnames";
import BaseButton from "../button/baseButton";

export default function ListCard({

}) {
	return (
		<div>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>
					<Image src="/images/cook2.jpg" alt="cook" fill style={{ objectFit: 'cover' }} />
					<div className={styles.overlay}>
						<div className={styles.overlayText}>
							전채, 파스타, 해산물, 고기요기 그리고<br />
							마지막 디저트로 완성된 5코스 요리로<br />
							플레이팅까지 근사한 홈 파티에<br />
							최적화된 요리들로 준비했습니다.<br />
							<span>중급자 시청 추천</span>
						</div>
					</div>
				</div>
				<div className={styles.baseWrapper}>
					<div className={styles.textWrapper}>
						<div className={styles.title}>
							<span className={styles.highlight}>이탈리아 현지 미슐랭 요리사에게 배우는 <br />
								파스타, 뇨끼, 리조또! 프리미 피아띠 정복하기</span>
						</div>
						<div>
							김밀란 • Live • 8명 시청 중
						</div>
						<div>
							평균 별점 ★★★★☆
						</div>
						<BaseButton
							title="찜"
							variant="custom"
							type="submit"
							size="sm"
							className={styles.wishButton}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

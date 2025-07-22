import Image from "next/image";
import styles from "./listCard.module.scss";
import classNames from "classnames";

export default function ListCard({

}) {
	return (
		<div>
			<div className={styles.card}>
				<div className={styles.imageWrapper}>

					<Image src="/images/cook2.jpg" alt="cook" fill style={{ objectFit: 'cover' }}></Image>
				</div>
				<div className={styles.textWrapper}>
					<div>
						이탈리아 현지 미슐랭 요리사에게 배우는 <br />
						파스타, 뇨끼, 리조또! 프리미 피아띠 정복하기
					</div>
					<div>
						김밀란 • Live • 8명 시청 중
					</div>
					<div>
						평균 별점 ★★★★☆
					</div>
				</div>
			</div>
		</div>
	);
}

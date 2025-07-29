import Image from 'next/image'
import styles from './card.module.scss'

export default function Card() {
    return (
        <div className={styles.container}>
            <Image src="/images/featured_banner_2.jpg" alt='food' width={208} height={150} style={{ objectFit: 'cover', borderRadius: '10px' }} ></Image>
            <div className={styles.title}>
                이탈리아 현지 미슐랭 요리사에게 배우는
                파스타, 뇨끼, 리조또! 프리미 피아띠 정복하기
            </div>
        </div>
    )
}
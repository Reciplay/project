import MainCarousel from '@/components/carousel/carousel'
import styles from './page.module.scss'
import CardWrapper from './__components/cardWrapper'
import CardWrapper1 from './__components/cardWrapper1'

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.carouselWrapper}>
        <MainCarousel></MainCarousel>
      </div>
      <div className={styles.learning}>
        <span className={styles.learntitle}>수강중인 강좌</span>
        <CardWrapper></CardWrapper>
      </div>
      <div className={styles.commingsoon}>
        <span className={styles.soontitle}>계설예정 강좌</span>
        <CardWrapper1></CardWrapper1>
      </div>
    </div>
  )
}
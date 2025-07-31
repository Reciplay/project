import Card from '@/components/card/card'
import styles from './cardWrapper1.module.scss'
import { CARDTYPE } from "@/types/card";
import { sampleCourse2 } from '@/config/sampleCourse';

export default function CardWrapper1() {
    return (
        <div className={styles.cardWrapper}>
            {sampleCourse2.map((course) => (
                <Card key={course.id} data={course} type={CARDTYPE.VERTICAL} />
            ))}
        </div>
    )
}
import CourseList from './__components/courseList/courseList';
import Overview from './__components/overview/overview';
import Schedule from './__components/schedule/schedule';
import Statistics from './__components/statistics/statistics';
import styles from './page.module.scss';

export default function Page() {
    return (
        <div>
            <div className={styles.cardContainer}>
                <div>
                    <Statistics></Statistics>
                    <Overview></Overview>
                </div>
                <Schedule></Schedule>
            </div>
            <CourseList></CourseList>
        </div>
    )
}
import Overview from './__components/overview/overview';
import Schedule from './__components/schedule/schedule';
import styles from './page.module.scss';
import Statistics from './__components/statistics/statistics';
import QandAList from './__components/q&alist/q&aList';

export default function Page() {
    return (
        <div>
            <div className={styles.cardContainer}>
                <div>
                    <Statistics></Statistics>
                    <Overview />
                </div>
                <Schedule />
            </div>
            <QandAList></QandAList>
        </div>
    );
}

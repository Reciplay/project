import Image from 'next/image';
import styles from './schedule.module.scss';

export default function Schedule() {
    return (
        <div className={styles.container}>
            <div className={styles.divTag}></div>
            <div className={styles.schedule}>
                <span>스케줄</span>
                <ul>
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                    <li><Image src="/images/Ellipse.png" alt='ellipse' width={10} height={10} />한식 강좌</li>
                    <hr />
                </ul>
            </div>
        </div>
    )
}
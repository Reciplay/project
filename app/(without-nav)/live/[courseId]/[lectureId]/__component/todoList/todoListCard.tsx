import styles from './todoListCard.module.scss';
import { cookingChapters } from '@/stores/cookingChapterStore';
import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export default function TodoListCard() {
    const getStepClassName = (status: string) => {
        switch (status) {
            case 'completed':
                return styles.stepperCompleted;
            case 'active':
                return styles.stepperActive;
            case 'pending':
                return styles.stepperPending;
            default:
                return '';
        }
    };

    return (
        <div className={styles.stepperBox}>
            <div className={styles.stepperContainer}>
                {cookingChapters.map((chapter, index) => (
                    <div key={index} className={`${styles.stepperStep} ${getStepClassName(chapter.status)}`}>
                        <div className={styles.stepperCircle}>
                            {chapter.status === 'completed' ? (
                                <svg
                                    viewBox="0 0 16 16"
                                    className="bi bi-check-lg"
                                    fill="currentColor"
                                    height="16"
                                    width="16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                </svg>
                            ) : (
                                chapter.step
                            )}
                        </div>
                        <div className={styles.stepperLine}></div>
                        <div className={styles.stepperContent}>
                            <div className={styles.stepperTitle}>{chapter.title}</div>
                            <div className={styles.timelineContent}>
                                <Timeline
                                    items={chapter.checklist.map((item, itemIndex) => ({
                                        key: itemIndex,
                                        children: `${item.label} ${item.duration}` + (item.note ? ` ${item.note}` : ''),
                                        dot: item.checked ? <ClockCircleOutlined className={styles.timelineClockIcon} /> : undefined,
                                    }))}
                                />
                            </div>
                            <div className={styles.stepperStatus}>{chapter.statusText}</div>
                            <div className={styles.stepperTime}>{chapter.time}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}

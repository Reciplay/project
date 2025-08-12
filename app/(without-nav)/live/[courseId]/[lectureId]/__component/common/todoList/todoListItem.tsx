// components/TodoListItem.tsx
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import styles from './todoListCard.module.scss';

interface TodoListItemProps {
    stepNumber: number | string;
    title: string;
    status: 'completed' | 'active' | 'pending';
    items: {
        content: string;
        isCurrent?: boolean;
        color?: string;
    }[];
}

export default function TodoListItem({ stepNumber, title, status, items }: TodoListItemProps) {
    const statusClass = {
        completed: styles.stepperCompleted,
        active: styles.stepperActive,
        pending: styles.stepperPending,
    }[status];

    return (
        <div className={`${styles.stepperStep} ${statusClass}`}>
            <div className={styles.stepperCircle}>
                {status === 'completed' ? (
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
                    stepNumber
                )}
            </div>
            <div className={styles.stepperLine}></div>
            <div className={styles.stepperContent}>
                <div className={styles.stepperTitle}>{title}</div>

                <div className={styles.timelineContent}>
                    <Timeline
                        items={items.map((item) => ( {
                            children: item.content,
                            color: item.color,
                            dot: item.isCurrent ? <ClockCircleOutlined className={styles.timelineClockIcon} /> : undefined,
                        }))}
                        />
                </div>
            </div>
        </div>  
    );
}

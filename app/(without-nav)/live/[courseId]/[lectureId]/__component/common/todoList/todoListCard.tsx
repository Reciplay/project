'use client';

import { useMemo } from 'react';
import { Timeline, Empty, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useLiveStore } from '@/stores/liveStore';

const formatSeconds = (seconds?: number | null) => {
    if (seconds == null) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

export default function TodoListCardTimeline() {
    const chapter = useLiveStore((s) => s.chapter);

    // 임시 데이터 (없을 때만)
    const effective = chapter ?? {
        chapterSequence: 1,
        chapterName: '테스트 챕터',
        numOfTodos: 2,
        todos: [
            { title: '재료 손질하기', type: 'NORMAL' as const, seconds: null, sequence: 1 },
            { title: '5분간 끓이기', type: 'TIMER' as const, seconds: 300, sequence: 2 },
            { title: '양념 만들기', type: 'NORMAL' as const, seconds: null, sequence: 3 },
            { title: '10분간 재우기', type: 'TIMER' as const, seconds: 600, sequence: 4 },
            { title: '팬 예열하기', type: 'NORMAL' as const, seconds: null, sequence: 5 },
            { title: '고기 굽기', type: 'TIMER' as const, seconds: 420, sequence: 6 },
            { title: '야채 넣고 볶기', type: 'NORMAL' as const, seconds: null, sequence: 7 },
        ]
    };

    const items = useMemo(
        () =>
            effective.todos
                .slice()
                .sort((a, b) => a.sequence - b.sequence)
                .map((todo) => {
                    const isTimer = todo.type === 'TIMER';
                    const timeText = isTimer && typeof todo.seconds === 'number' ? ` • ${formatSeconds(todo.seconds)}` : '';
                    return {
                        key: String(todo.sequence),
                        color: isTimer ? 'red' : 'blue',
                        dot: isTimer ? <ClockCircleOutlined /> : undefined,
                        children: (
                            <div>
                                <strong>{todo.title}</strong>
                                {timeText}
                            </div>
                        ),
                    };
                }),
        [effective]
    );

    if (!effective || effective.todos.length === 0) {
        return <Empty description="체크리스트가 없습니다" />;
    }

    return (
        <Card
            title={`현재 챕터: #${effective.chapterSequence} — ${effective.chapterName}`}
            extra={<span>할 일 {effective.numOfTodos}개</span>}
            bodyStyle={{ paddingTop: 12 }}
        >
            <Timeline items={items} />
        </Card>
    );
}

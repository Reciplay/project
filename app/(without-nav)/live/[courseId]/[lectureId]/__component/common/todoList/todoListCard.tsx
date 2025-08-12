'use client';

import { useEffect, useMemo, useState } from 'react';
import { Timeline, Empty, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useLiveStore } from '@/stores/liveStore';
import type { TimelineItemProps } from 'antd/es/timeline/TimelineItem';

type TodoType = 'NORMAL' | 'TIMER'

type TodoItem = {
  title: string;
  type: 'NORMAL' | 'TIMER';
  seconds: number | null; // 수정된 부분: null 허용
  sequence: number;
};

type ChapterCard = {
  chapterId: number;           // 서버 응답에 있음
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: TodoItem[];
}

type TodoListCardProps = {
  chapterCard?: ChapterCard; // 수정된 부분: optional로 변경
};
const formatSeconds = (seconds?: number | null) => {
    if (seconds == null) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

export default function TodoListCardTimeline(props: TodoListCardProps) {

    useEffect(() => {
        console.log(props)
    }, [props])
    
    // if (!props.chapter) {
    // props.chapter = {
    //     chapterSequence: 1,
    //     chapterName: '테스트 챕터',
    //     numOfTodos: 2,
    //     todos: [
    //         { title: '재료 손질하기', type: 'NORMAL' as const, seconds: null, sequence: 1 },
    //         { title: '5분간 끓이기', type: 'TIMER' as const, seconds: 300, sequence: 2 },
    //         { title: '양념 만들기', type: 'NORMAL' as const, seconds: null, sequence: 3 },
    //         { title: '10분간 재우기', type: 'TIMER' as const, seconds: 600, sequence: 4 },
    //         { title: '팬 예열하기', type: 'NORMAL' as const, seconds: null, sequence: 5 },
    //         { title: '고기 굽기', type: 'TIMER' as const, seconds: 420, sequence: 6 },
    //         { title: '야채 넣고 볶기', type: 'NORMAL' as const, seconds: null, sequence: 7 },
    //     ]
    // }    }
 
    // 임시 데이터 (없을 때만)
   const effective = props.chapterCard ?? {
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
  ],
};
    const items = useMemo<TimelineItemProps[]>(
  () =>
    (effective?.todos ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map((todo) => {
        const isTimer = todo.type === 'TIMER';
        const hasSeconds = typeof todo.seconds === 'number' && todo.seconds >= 0;
        const timeText = isTimer && hasSeconds ? ` • ${formatSeconds(todo.seconds as number)}` : '';

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
        } as TimelineItemProps; // 수정된 부분: 명시적 캐스팅(안전하게 타입 맞춤)
      }),
  // 수정된 부분: 의존성은 todos만 두는 게 불필요 렌더 줄이는 데 유리
  [effective?.todos]
);

    if (!effective || effective.todos.length === 0) {
        return <Empty description="체크리스트가 없습니다" />;
    }

    return (
        <Card
            title={`현재 챕터: #${effective.chapterSequence} — ${effective.chapterName}`}
            extra={<span>할 일 {effective.numOfTodos}개</span>}

        >
            <Timeline items={items} />
        </Card>
    );
}

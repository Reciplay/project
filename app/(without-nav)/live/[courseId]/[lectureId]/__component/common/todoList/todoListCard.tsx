"use client";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Empty, Timeline } from "antd";
import type { TimelineItemProps } from "antd/es/timeline/TimelineItem";
import { useEffect, useMemo } from "react";

// type TodoType = "NORMAL" | "TIMER"; !태욱 사용하지 않는 변수라서 주석처리함

type TodoItem = {
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number | null; // 수정된 부분: null 허용
  sequence: number;
};

export type ChapterCard = {
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: TodoItem[];
};

type TodoListCardProps = {
  chapterCard?: ChapterCard; // 수정된 부분: optional로 변경
};
const formatSeconds = (seconds?: number | null) => {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

export default function TodoListCard(props: TodoListCardProps) {
  useEffect(() => {
    console.log(props);
  }, [props]);

  // 임시 데이터 (없을 때만)
  const effective = props.chapterCard ?? {
    chapterSequence: 1,
    chapterName: "챕터를 불러오는 중입니다...",
    numOfTodos: 1,
    todos: [
      {
        title: "Todo List를 불러오는 중입니다...",
        type: "NORMAL" as const,
        seconds: null,
        sequence: 1,
      },
      {
        title: "Todo List를 불러오는 중입니다...",
        type: "TIMER" as const,
        seconds: 300,
        sequence: 2,
      },
    ],
  };
  const items = useMemo<TimelineItemProps[]>(
    () =>
      (effective?.todos ?? [])
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map((todo) => {
          const isTimer = todo.type === "TIMER";
          const hasSeconds =
            typeof todo.seconds === "number" && todo.seconds >= 0;
          const timeText =
            isTimer && hasSeconds
              ? ` • ${formatSeconds(todo.seconds as number)}`
              : "";

          return {
            key: String(todo.sequence),
            color: isTimer ? "red" : "blue",
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
    [effective?.todos],
  );

  if (!effective || effective.todos.length === 0) {
    return <Empty description="체크리스트가 없습니다" />;
  }

  return (
    <Card
      title={`${effective.chapterName}`}
      extra={<span>할 일 {effective.numOfTodos}개</span>}
    >
      <Timeline items={items} />
    </Card>
  );
}

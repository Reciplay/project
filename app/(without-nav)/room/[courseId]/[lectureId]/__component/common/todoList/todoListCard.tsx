"use client";

import { IconClock } from "@tabler/icons-react"; // ✅ Tabler 아이콘
import { useMemo } from "react";
import styles from "./todoListCard.module.scss";

type TodoItem = {
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number | null;
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
  chapterCard?: ChapterCard;
  currentTodoSequence?: number | null;
};

const formatSeconds = (seconds?: number | null) => {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

export default function TodoListCard({
  chapterCard,
  currentTodoSequence,
}: TodoListCardProps) {
  const effective = chapterCard ?? {
    chapterSequence: 1,
    chapterName: "챕터를 불러오는 중입니다...",
    numOfTodos: 2,
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

  const items = useMemo(() => {
    return (effective?.todos ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map((todo) => {
        const isTimer = todo.type === "TIMER";
        const hasSeconds =
          typeof todo.seconds === "number" && todo.seconds >= 0;
        const timeText =
          isTimer && hasSeconds ? ` • ${formatSeconds(todo.seconds)}` : "";
        const isActive = todo.sequence === currentTodoSequence;
        const isPast =
          currentTodoSequence != null && todo.sequence < currentTodoSequence;

        return {
          ...todo,
          timeText,
          isActive,
          isPast,
        };
      });
  }, [effective?.todos, currentTodoSequence]);

  return (
    <div className={styles.timeline}>
      <div className={styles.header}>
        <h3>{effective.chapterName}</h3>
        <span>할 일 {effective.numOfTodos}개</span>
      </div>

      {items.map((todo) => (
        <div
          key={todo.sequence}
          className={`${styles.item} ${todo.isActive ? styles.active : ""} ${
            todo.isPast ? styles.past : ""
          } ${todo.type === "TIMER" ? styles.timer : styles.normal}`}
        >
          {todo.type === "TIMER" ? (
            <IconClock size={16} color={todo.isActive ? "#ff4d4f" : "#888"} />
          ) : (
            <div className={styles.dot} />
          )}

          <div className={styles.content}>
            <span className={styles.title}>{todo.title}</span>
            {todo.timeText && (
              <span className={styles.time}>{todo.timeText}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

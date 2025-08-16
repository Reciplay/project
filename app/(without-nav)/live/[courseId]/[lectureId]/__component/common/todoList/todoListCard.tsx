// "use client";

// import { ClockCircleOutlined } from "@ant-design/icons";
// import { Card, Empty, Timeline } from "antd";
// import type { TimelineItemProps } from "antd/es/timeline/TimelineItem";
// import { useEffect, useMemo } from "react";
// import styles from "./todoListCard.module.scss";

// // type TodoType = "NORMAL" | "TIMER"; !태욱 사용하지 않는 변수라서 주석처리함

// type TodoItem = {
//   title: string;
//   type: "NORMAL" | "TIMER";
//   seconds: number | null; // 수정된 부분: null 허용
//   sequence: number;
// };

// export type ChapterCard = {
//   chapterId: number;
//   chapterSequence: number;
//   chapterName: string;
//   numOfTodos: number;
//   todos: TodoItem[];
// };

// type TodoListCardProps = {
//   chapterCard?: ChapterCard; // 수정된 부분: optional로 변경
//   currentTodoSequence?: number | null;
// };
// const formatSeconds = (seconds?: number | null) => {
//   if (seconds == null) return "";
//   const m = Math.floor(seconds / 60);
//   const s = seconds % 60;
//   return m > 0 ? `${m}분 ${s}초` : `${s}초`;
// };

// export default function TodoListCard(props: TodoListCardProps) {
//   useEffect(() => {
//     console.log(props);
//   }, [props]);

//   // 임시 데이터 (없을 때만)
//   const effective = props.chapterCard ?? {
//     chapterSequence: 1,
//     chapterName: "챕터를 불러오는 중입니다...",
//     numOfTodos: 1,
//     todos: [
//       {
//         title: "Todo List를 불러오는 중입니다...",
//         type: "NORMAL" as const,
//         seconds: null,
//         sequence: 1,
//       },
//       {
//         title: "Todo List를 불러오는 중입니다...",
//         type: "TIMER" as const,
//         seconds: 300,
//         sequence: 2,
//       },
//     ],
//   };
//   const items = useMemo<TimelineItemProps[]>(
//     () =>
//       (effective?.todos ?? [])
//         .slice()
//         .sort((a, b) => a.sequence - b.sequence)
//         .map((todo) => {
//           const isTimer = todo.type === "TIMER";
//           const hasSeconds =
//             typeof todo.seconds === "number" && todo.seconds >= 0;
//           const timeText =
//             isTimer && hasSeconds
//               ? ` • ${formatSeconds(todo.seconds as number)}`
//               : "";
//           const isActive = todo.sequence === props.currentTodoSequence;

//           return {
//             key: String(todo.sequence),
//             color: isTimer ? "red" : "blue",
//             className: isActive ? styles.activeTodo : "",
//             dot: isTimer ? <ClockCircleOutlined /> : undefined,
//             children: (
//               <div>
//                 <strong>{todo.title}</strong>
//                 {timeText}
//               </div>
//             ),
//           } as TimelineItemProps; // 수정된 부분: 명시적 캐스팅(안전하게 타입 맞춤)
//         }),
//     // 수정된 부분: 의존성은 todos만 두는 게 불필요 렌더 줄이는 데 유리
//     [effective?.todos, props.currentTodoSequence],
//   );

//   if (!effective || effective.todos.length === 0) {
//     return <Empty description="체크리스트가 없습니다" />;
//   }

//   return (
//     <Card
//       title={`${effective.chapterName}`}
//       extra={<span>할 일 {effective.numOfTodos}개</span>}
//     >
//       <Timeline items={items} />
//     </Card>
//   );
// }
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
          className={`${styles.item} ${
            todo.isActive ? styles.active : ""
          } ${todo.isPast ? styles.past : ""} ${
            todo.type === "TIMER" ? styles.timer : styles.normal
          }`}
        >
          {todo.type === "TIMER" ? (
            <IconClock
              size={16}
              color={todo.isActive ? "#ff4d4f" : "#aaa"}
              style={{ position: "absolute", left: 2, top: 2 }}
            />
          ) : (
            <div className={styles.dot} />
          )}

          <div className={styles.content}>
            <span>
              {todo.title}
              {todo.timeText}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

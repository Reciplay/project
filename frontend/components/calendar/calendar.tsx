"use client";

import type { CourseDetail } from "@/types/course";
import { LectureSummary } from "@/types/lecture";
import type { CalendarApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./calendar.module.scss";

type Lecture = CourseDetail["lectureSummaryList"][number];

interface FCEvent {
  title: string;
  date: string; // YYYY-MM-DD
  extendedProps: {
    lectureId: number;
    isSkipped: boolean;
  };
}

interface SidebarProps {
  selectedDate: string | null;
  allEvents: FCEvent[];
  onDateClick: (date: string) => void;
}

const ScheduleSidebar = ({
  selectedDate,
  allEvents,
  onDateClick,
}: SidebarProps) => {
  const eventsSorted = useMemo(
    () =>
      [...allEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [allEvents],
  );

  return (
    <aside className={styles.sidebar}>
      <h2>전체 일정</h2>
      <ul className={styles.eventList}>
        {eventsSorted.map((event, idx) => {
          const same = event.date === selectedDate;
          return (
            <li
              key={`${event.extendedProps.lectureId}-${idx}`}
              onClick={() => onDateClick(event.date)}
              className={[
                same ? styles.selected : "",
                event.extendedProps.isSkipped ? styles.skipped : "",
              ].join(" ")}
            >
              <span className={styles.eventDate}>
                {new Date(event.date).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className={styles.eventTitle}>{event.title}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

// 안전한 YYYY-MM-DD 변환 (잘못된 날짜면 null)
function toYMDStrict(iso: unknown): string | null {
  if (typeof iso !== "string") return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  // 올데이(date)에는 UTC기준 YYYY-MM-DD가 안전
  return new Date(t).toISOString().slice(0, 10);
}

function toYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 타입가드: 유효한 startedAt을 가진 Lecture만 통과
function hasValidStart(
  l: Lecture,
): l is Lecture & { startedAt: string; title: string } {
  return toYMDStrict(l?.startedAt) !== null;
}

export default function Calendar({
  lectures,
}: {
  lectures: LectureSummary[] | undefined;
}) {
  const calendarRef = useRef<CalendarApi | null>(null);

  // lectures → FullCalendar events (date는 항상 string 보장)
  const events: FCEvent[] = useMemo(
    () =>
      (lectures ?? []).filter(hasValidStart).map((l) => ({
        title: l.title,
        date: toYMDStrict(l.startedAt)!,
        extendedProps: {
          lectureId: l.lectureId,
          isSkipped: !!l.isSkipped,
        },
      })),
    [lectures],
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 초기 선택/이동 (first 존재 체크)
  useEffect(() => {
    const first = events[0];
    if (first) {
      setSelectedDate(first.date);
      calendarRef.current?.gotoDate(first.date); // string 보장
    } else {
      setSelectedDate(null);
    }
  }, [events]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    calendarRef.current?.gotoDate(date);
  };

  return (
    <div className={styles.layout}>
      <ScheduleSidebar
        selectedDate={selectedDate}
        allEvents={events}
        onDateClick={handleDateSelect}
      />

      <div className={styles.calendar}>
        <FullCalendar
          ref={(el) => {
            if (el) calendarRef.current = el.getApi();
          }}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          height={560}
          contentHeight={560}
          aspectRatio={1.8}
          dayMaxEvents={false}
          selectable
          events={events}
          dateClick={(info) => handleDateSelect(info.dateStr)}
          dayCellContent={(arg) => arg.date.getDate().toString()}
          // 선택된 날짜 하이라이트 (반환형을 명시적으로 string[]로)
          dayCellClassNames={(arg): string[] => {
            if (!selectedDate) return [];
            const isSelected = toYMDLocal(arg.date) === selectedDate;
            const cls = styles.selectedCell; // string | undefined
            return isSelected && cls ? [cls] : []; // ← 정의된 string만 반환
          }}
          eventContent={(arg) => {
            const skipped = Boolean(arg.event.extendedProps["isSkipped"]);
            return (
              <span
                className={`${styles.dot} ${skipped ? styles.dotSkipped : ""}`}
                title={arg.event.title}
              />
            );
          }}
        />
      </div>
    </div>
  );
}

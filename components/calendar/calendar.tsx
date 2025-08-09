"use client";

import type { CourseDetail } from "@/types/course";
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
  // 전체 이벤트를 날짜 오름차순으로 정렬(선택)
  const eventsSorted = useMemo(
    () =>
      [...allEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [allEvents]
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

function toYMD(iso: string) {
  return iso.split("T")[0];
}
function toYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Calendar({
  lectures,
}: {
  lectures: Lecture[] | undefined;
}) {
  const calendarRef = useRef<CalendarApi | null>(null);

  // lectures → FullCalendar events
  const events: FCEvent[] = useMemo(
    () =>
      (lectures ?? []).map((l) => ({
        title: l.title,
        date: toYMD(l.startedAt),
        extendedProps: { lectureId: l.lectureId, isSkipped: l.isSkipped },
      })),
    [lectures]
  );

  // 사이드바 선택(하이라이트) 상태
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 초기 선택/이동
  useEffect(() => {
    if (events.length) {
      setSelectedDate(events[0].date);
      calendarRef.current?.gotoDate(events[0].date);
    } else {
      setSelectedDate(null);
    }
  }, [events]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    calendarRef.current?.gotoDate(date); // 포커스 이동
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
          // 선택된 날짜 하이라이트 클래스 부여
          dayCellClassNames={(arg) => {
            if (!selectedDate) return [];
            return toYMDLocal(arg.date) === selectedDate
              ? [styles.selectedCell]
              : [];
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

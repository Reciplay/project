"use client";

import type { CourseDetail } from "@/types/course";
import type { CalendarApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./calendarOnly.module.scss";

type Lecture = CourseDetail["lectureSummaryList"][number];

function toYMD(iso: string) {
  return iso.split("T")[0];
}
function toYMDLocal(d: Date) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarOnly({
  lectures,
  height = 560,
}: {
  lectures?: Lecture[];
  height?: number;
}) {
  const calendarRef = useRef<CalendarApi | null>(null);

  const events = useMemo(
    () =>
      (lectures ?? []).map((l) => ({
        title: l.title,
        date: toYMD(l.startedAt),
        extendedProps: { lectureId: l.lectureId, isSkipped: l.isSkipped },
      })),
    [lectures]
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (events.length) {
      setSelectedDate(events[0].date);
      calendarRef.current?.gotoDate(events[0].date);
    } else setSelectedDate(null);
  }, [events]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* ★ 래퍼 추가: 이 클래스에 스타일과 CSS 변수 부여 */}
        <div className={styles.fcSkin}>
          <FullCalendar
            ref={(el) => {
              if (el) calendarRef.current = el.getApi();
            }}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            height={height}
            contentHeight={height}
            aspectRatio={1.8}
            dayMaxEvents={false}
            selectable
            events={events}
            dateClick={(info) => setSelectedDate(info.dateStr)}
            dayCellContent={(arg) => arg.date.getDate().toString()}
            dayCellClassNames={(arg) =>
              selectedDate && toYMDLocal(arg.date) === selectedDate
                ? [styles.selectedCell]
                : []
            }
            eventContent={(arg) => (
              <span
                className={`${styles.dot} ${
                  arg.event.extendedProps["isSkipped"] ? styles.dotSkipped : ""
                }`}
                title={arg.event.title}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

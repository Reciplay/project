import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./calendar.module.scss";
import koLocale from "@fullcalendar/core/locales/ko";

interface EventType {
  title: string;
  date: string;
}

interface SidebarProps {
  date: string;
  allEvents: EventType[];
}

// 왼쪽 사이드바 컴포넌트 예시
const ScheduleSidebar = ({ date, allEvents }: SidebarProps) => {
  const filtered = allEvents.filter((e) => e.date === date);
  const dateText = new Date(date).toLocaleDateString("ko-KR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.sidebar}>
      <h2>{dateText}</h2>
      <ul>
        {filtered.map((event, idx) => (
          <li key={idx}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState("2025-07-23");
  const events = [
    { title: "Team Meeting", date: "2025-07-23" },
    { title: "Lunch with Sasha", date: "2025-07-23" },
    { title: "Design Review", date: "2025-07-23" },
    { title: "Get Groceries", date: "2025-07-23" },
    { title: "Coffee Chat", date: "2025-07-24" },
  ];

  return (
    <>
      <div className={styles.layout}>
        <ScheduleSidebar date={selectedDate} allEvents={events} />
        <div className={styles.calendar}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            dayMaxEvents={1}
            selectable={true}
            events={events}
            dateClick={(info) => setSelectedDate(info.dateStr)}
            eventContent={(arg) => {
              const eventCount = events.filter(
                (e) => e.date === arg.event.startStr
              ).length;

              if (arg.isStart) {
                return (
                  <div className={styles.eventSummary}>
                    {eventCount > 1 ? (
                      <span>{eventCount} items</span>
                    ) : (
                      <span>{arg.event.title}</span>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
      </div>
    </>
  );
}

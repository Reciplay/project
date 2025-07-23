import type { CalendarApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useRef, useState } from "react";
import styles from "./calendar.module.scss";

interface EventType {
  title: string;
  date: string;
}

interface SidebarProps {
  date: string;
  allEvents: EventType[];
  onDateClick: (date: string) => void;
}

const ScheduleSidebar = ({ date, allEvents, onDateClick }: SidebarProps) => {
  const selectedDate = new Date(date);
  const currentMonthEvents = allEvents.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className={styles.sidebar}>
      <h2>
        {selectedDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
        })}
      </h2>
      <ul className={styles.eventList}>
        {currentMonthEvents.map((event, idx) => (
          <li
            key={idx}
            onClick={() => onDateClick(event.date)}
            className={event.date === date ? styles.selected : undefined}
          >
            <span className={styles.eventDate}>
              {new Date(event.date).getDate()}일
            </span>{" "}
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Calendar() {
  const calendarRef = useRef<CalendarApi | null>(null);
  const [selectedDate, setSelectedDate] = useState("2025-07-23");

  const events: EventType[] = [
    { title: "Team Meeting", date: "2025-07-23" },
    { title: "Lunch with Sasha", date: "2025-07-23" },
    { title: "Design Review", date: "2025-07-23" },
    { title: "Get Groceries", date: "2025-07-23" },
    { title: "Coffee Chat", date: "2025-07-24" },
    { title: "Sprint Demo", date: "2025-07-26" },
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    calendarRef.current?.gotoDate(date);
  };

  return (
    <div className={styles.layout}>
      <ScheduleSidebar
        date={selectedDate}
        allEvents={events}
        onDateClick={handleDateSelect}
      />
      <div className={styles.calendar}>
        <FullCalendar
          ref={(el) => {
            if (el) {
              calendarRef.current = el.getApi();
            }
          }}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          dayMaxEvents={false}
          selectable={true}
          events={events}
          dateClick={(info) => setSelectedDate(info.dateStr)}
          dayCellContent={(arg) => arg.date.getDate().toString()}
          eventContent={() => <span className={styles.dot} />}
        />
      </div>
    </div>
  );
}

"use client";

import { forwardRef, useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

type Props = {
  events: any[];
  onDateClick: (startStr: string) => void;
  onEventClick?: (id: string) => void;
  onYearChange?: (year: number) => void;
  onDatesSet?: (dateInfo: any) => void;
  currentYear: number;
};

const Calendar = forwardRef<FullCalendar | null, Props>(
  ({ events, onDateClick, onEventClick, onYearChange, onDatesSet, currentYear }, ref) => {
    const [tentativeEvent, setTentativeEvent] = useState<any>(null);
    const lastSelectedRef = useRef<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const allEvents = tentativeEvent ? [...events, tentativeEvent] : events;

    const handleSelect = (info: any) => {
      if (lastSelectedRef.current === info.startStr) {
        onDateClick(info.startStr);
      } else {
        lastSelectedRef.current = info.startStr;
        setTentativeEvent({
          id: "tentative",
          start: info.startStr,
          end: info.endStr,
          title: "Confirmar Turno...",
          backgroundColor: "rgba(59, 130, 246, 0.4)",
          borderColor: "#3b82f6",
          display: "block",
        });
      }
    };

    return (
      <div className="calendar-container w-full bg-white rounded-xl shadow-sm border p-2 sm:p-4 h-[80vh] flex flex-col">
        <div className="flex justify-end mb-4 items-center gap-2 shrink-0">
          <label className="text-xs font-bold uppercase text-gray-500">Año:</label>
          <select
            value={currentYear}
            onChange={(e) => onYearChange?.(Number(e.target.value))}
            className="border rounded-lg px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-h-0">
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            locale={esLocale}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            firstDay={0}
            height="100%"
            contentHeight="auto"
            dayMaxEvents={2}
            scrollTime="09:00:00"
            slotDuration="00:30:00"
            slotLabelFormat={{
              hour: "2-digit", // fuerza dos dígitos
              minute: "2-digit", // siempre muestra los minutos
              hour12: false, // 24h
            }}
            allDaySlot={false}
            stickyHeaderDates={true}
            expandRows={false}
            handleWindowResize={true}
            events={allEvents}
            selectable={true}
            unselectAuto={false}
            select={handleSelect}
            eventClick={(info) => {
              if (info.event.id === "tentative") onDateClick(info.event.startStr);
              else onEventClick?.(info.event.id);
            }}
            unselect={() => {
              setTentativeEvent(null);
              lastSelectedRef.current = null;
            }}
            datesSet={(dateInfo) => {
              setTentativeEvent(null);
              lastSelectedRef.current = null;
              onDatesSet?.(dateInfo);
            }}
          />
        </div>
      </div>
    );
  },
);

Calendar.displayName = "Calendar";
export default Calendar;

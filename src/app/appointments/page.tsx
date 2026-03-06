"use client";

import { useState, useRef } from "react";
import Calendar from "../components/calendar";
import { useAppointments } from "../hooks/useAppointments";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const calendarRef = useRef<any>(null);
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());

  const [range, setRange] = useState({
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });

  const { data, isLoading } = useAppointments(range.start, range.end);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const currentDate = api.getDate();
      const newDate = new Date(currentDate);
      newDate.setFullYear(newYear);
      api.gotoDate(newDate);
    }
  };

  // Every time the calendar changes the visible range.
  const handleDatesSet = (dateInfo: any) => {
    setRange({
      start: dateInfo.startStr,
      end: dateInfo.endStr,
    });
  };

  // This is called when a date is clicked.
  // It can be a real event (with id) or a tentative one (id = "tentative")
  const handleDateSelection = (startStr: string) => {
    // FullCalendar sometimes sends startStr as null, we ignore those cases.
    if (!startStr) return;

    const [date, fullTime] = startStr.split("T");
    // If there is no time (month view), we set it to 00:00
    const time = fullTime ? fullTime.substring(0, 5) : "00:00";

    router.push(`/appointments/create?date=${date}&time=${time}`);
  };

  const handleEventClick = (eventId: string) => {
    // If it's the tentative event, we do nothing here.
    // onDateClick already handles it through the Calendar component.
    if (eventId === "tentative") return;

    // Si es un evento real, vamos al detalle.
    router.push(`/appointments/${eventId}`);
  };

  const events =
    data?.map((event: any) => ({
      id: event.id,
      title: event.summary || "Sin título",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      allDay: !event.start?.dateTime,
    })) ?? [];

  return (
    <div className="p-4 h-screen min-h-0 flex flex-col overflow-hidden">
      <Calendar
        ref={calendarRef}
        events={events}
        currentYear={year}
        onYearChange={handleYearChange}
        onDateClick={handleDateSelection}
        onEventClick={handleEventClick}
        onDatesSet={handleDatesSet}
      />

      <button
        onClick={() => router.push("/appointments/create")}
        className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition active:scale-95"
      >
        <PlusIcon size={24} />
      </button>
    </div>
  );
}

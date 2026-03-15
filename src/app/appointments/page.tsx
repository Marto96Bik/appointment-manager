"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "../components/calendar";
import { fetchAppointments } from "../clients/appointment.client";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/header";

export default function AppointmentsPage() {
  const calendarRef = useRef<any>(null);
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());

  const [range, setRange] = useState({
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  });

  const [appointments, setAppointments] = useState<any[]>([]);

  // Fetch appointments on date range change.
  useEffect(() => {
    const loadAppointments = async () => {
      const data = await fetchAppointments(range.start, range.end);

      setAppointments(data);
    };
    loadAppointments();
  }, [range.start, range.end]);

  // Map appointments to calendar event format.
  const events =
    appointments?.map((appointment) => ({
      id: appointment.eventId,
      title: appointment.name || "Turno sin título",
      start: appointment.start,
      end: appointment.end,
      allDay: false,
    })) ?? [];

  // Update calendar view when year changes.
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

  // Visible range setting.
  const handleDatesSet = (dateInfo: any) => {
    setRange({
      start: dateInfo.startStr,
      end: dateInfo.endStr,
    });
  };

  // Click on a calendar slot to create a new appointment.
  const handleDateSelection = (startStr: string) => {
    if (!startStr) return;
    const [date, fullTime] = startStr.split("T");
    const time = fullTime ? fullTime.substring(0, 5) : "00:00";

    router.push(`/appointments/create?date=${date}&time=${time}`);
  };

  // Click on an existing event to view/edit it.
  const handleEventClick = (eventId: string) => {
    if (eventId === "tentative") return;
    router.push(`/appointments/${eventId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <Calendar
          ref={calendarRef}
          events={events}
          currentYear={year}
          onYearChange={handleYearChange}
          onDateClick={handleDateSelection}
          onEventClick={handleEventClick}
          onDatesSet={handleDatesSet}
        />
      </div>

      <button
        onClick={() => router.push("/appointments/create")}
        className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-6 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition active:scale-95"
      >
        <PlusIcon size={24} />
      </button>
    </div>
  );
}

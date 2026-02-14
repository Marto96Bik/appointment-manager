"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Calendar from "../components/calendar";
import { useAppointments } from "../hooks/useAppointments";
import { PlusIcon } from "lucide-react";
import "../globals.css";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const calendarRef = useRef<any>(null);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11
  const currentDay = today.getDate();
  const router = useRouter();

  // Estado de los dropdowns
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [day, setDay] = useState(currentDay);

  // Lista de días del mes dinámicos
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    const days = new Date(year, month + 1, 0).getDate(); // último día del mes
    const dayArray = Array.from({ length: days }, (_, i) => i + 1);
    setDaysInMonth(dayArray);

    // Ajustar día si es mayor que los días del mes
    if (day > days) setDay(days);
  }, [year, month]);

  // Formatear fecha para la API
  const [selectedDate, setSelectedDate] = useState(
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`,
  );

  // Agregar un flag para diferenciar origen
  const [fromDropdown, setFromDropdown] = useState(false);

  // Cada vez que cambian año/mes/día, actualizar selectedDate
  useEffect(() => {
    setSelectedDate(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
    setFromDropdown(true);
  }, [year, month, day]);

  // Actualizar calendario
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate);
    }
    setFromDropdown(true);
  }, [selectedDate, fromDropdown]);

  // Ahora pasamos selectedDate al hook
  const { data, isLoading } = useAppointments(selectedDate);

  if (isLoading) return <div className="p-4">Loading...</div>;

  const events =
    data?.map((event: any) => ({
      id: event.id,
      title: event.summary || "Sin título", // Google usa 'summary'
      // Google entrega objetos para start y end, necesitamos el string de la fecha
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      // Opcional: puedes pasarle más datos si los necesitas en el onEventClick
      extendedProps: {
        description: event.description,
        status: event.status,
      },
    })) ?? [];

  // Crear años para el dropdown (últimos 5 años y 2 años futuros)
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); // TODO improve

  return (
    <div className="p-4">
      {/* Dropdowns */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Año:</label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <label className="font-medium">Mes:</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m).toLocaleString("es-AR", { month: "long" })}
            </option>
          ))}
        </select>

        <label className="font-medium">Día:</label>
        <select
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {daysInMonth.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        ref={calendarRef} // <- esto es clave
        events={events}
        onDateChange={(date) => {
          if (!fromDropdown) {
            const dt = new Date(date);
            setYear(dt.getFullYear());
            setMonth(dt.getMonth());
            setDay(dt.getDate());
          }
        }}
        onEventClick={(event) => {
          console.log("Clicked:", event.id);
        }}
      />
      {/* Floating Button */}
      <button
        onClick={() => router.push("/appointments/create")}
        className="
        fixed bottom-20 left-1/2 -translate-x-1/2
        z-50
        flex items-center gap-2
        px-4 py-4
        rounded-2xl
        bg-blue-600 hover:bg-blue-700
        text-white font-medium
        shadow-lg
        transition active:scale-95
        "
      >
        <PlusIcon size={20} />
        Crear Appointment
      </button>
    </div>
  );
}

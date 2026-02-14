"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAppointmentPage() {
  const router = useRouter();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [patientId, setPatientId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStart = start.length === 16 ? `${start}:00` : start;
    const formattedEnd = end.length === 16 ? `${end}:00` : end;

    const res = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: formattedStart,
        end: formattedEnd,
        patientId: Number(patientId),
      }),
    });

    if (res.ok) {
      router.push("/appointments"); // redirige a la lista
    } else {
      const error = await res.json();
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Crear Appointment</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Start:
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </label>

        <label>
          End:
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </label>

        <label>
          Patient ID:
          <input
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
            min={1}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </form>
    </div>
  );
}

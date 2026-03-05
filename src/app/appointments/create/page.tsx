"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// TODO: refactor this page, it's too big and has too much logic, split it into smaller components and hooks
type Patient = {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  documentId: string;
  userId: number;
};

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patient");
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export default function CreateAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30"); // en minutos
  const [customDuration, setCustomDuration] = useState("");
  const [patientId, setPatientId] = useState(1);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showNoPatientsModal, setShowNoPatientsModal] = useState(false);

  // Fetch patients for the dropdown
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetchPatients();
        setError(null);

        if (res && res.length > 0) {
          setPatients(res);
          setPatientId(res[0].id);
        } else {
          // En lugar de alert, mostramos el modal
          setShowNoPatientsModal(true);
        }
      } catch (err: any) {
        setError(err.message || "No se pudo eliminar el registro");
        // Podrías mostrar un toast o error aquí
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleNoPatients = () => {
    setShowNoPatientsModal(false);
    router.push("/patients/create");
  };

  // recives dateTime params from URL and sets them in the form
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const timeParam = searchParams.get("time");

    if (dateParam) {
      setDate(dateParam);
    }

    if (timeParam) {
      // FullCalendar sometimes sends HH:mm:ss, the input type="time" only accepts HH:mm, so we need to format it
      const formattedTime = timeParam.substring(0, 5);
      setTime(formattedTime);
    }
  }, [searchParams]);

  // Logic to get the final duration (predefined or custom)
  const finalDuration = duration === "custom" ? Number(customDuration) : Number(duration);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !finalDuration) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + finalDuration * 60000);

    // Format to local ISO type date string without timezone (e.g., 2024-06-30T14:30:00)
    const formatToISO = (d: Date) => d.toLocaleString("sv").replace(" ", "T");

    const res = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: formatToISO(startDateTime),
        end: formatToISO(endDateTime),
        patientId: Number(patientId),
      }),
    });

    if (res.ok) {
      router.push("/appointments");
    } else {
      const error = await res.json();
      alert("Error: " + error.message);
    }
  };

  if (loading) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">Cargando...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Asignar Turno</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Date & Time */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium">Duración</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hora</option>
              <option value="custom">Personalizado...</option>
            </select>
          </div>

          {duration === "custom" && (
            <div className="flex-1">
              <input
                type="number"
                placeholder="Minutos"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          )}
        </div>

        <label>
          <span className="block text-sm font-medium">Paciente</span>
          <select
            value={patientId}
            onChange={(e) => setPatientId(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.lastname}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition-colors"
        >
          Asignar Turno
        </button>
      </form>

      {/* Advert Modal */}
      {showNoPatientsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            setShowNoPatientsModal(false);
            router.push("/appointments");
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Evita que el click en el modal cierre el modal
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes pacientes</h3>
              <p className="text-gray-600 mb-6">
                Para crear un turno, primero debes dar de alta al menos un paciente en el sistema.
              </p>
              <button
                onClick={handleNoPatients}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition active:scale-95 shadow-lg shadow-blue-200"
              >
                Crear mi primer paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

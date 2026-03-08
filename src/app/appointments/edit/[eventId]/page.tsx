"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { WhatsAppLinkSuccess } from "@/app/components/whatsapp-link-success";
import Loader from "@/app/components/loader";

type Appointment = {
  id: number;
  start: string;
  end: string;
  eventId: string;
  patientId: number;
  userId: number;
};

type Patient = {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  documentId: string;
  userId: number;
};

async function fetchAppointment(eventId: string): Promise<Appointment> {
  const res = await fetch(`/api/appointment/${eventId}`);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (data && data.message === "Appointment not found") {
      throw new Error("Este evento no corresponde a un turno del sistema.");
    }
    throw new Error(data?.message || "Failed to fetch data");
  }

  return data as Appointment;
}

async function fetchPatient(id: number): Promise<Patient> {
  const res = await fetch(`/api/patient/${id}`);
  if (!res.ok) throw new Error("Failed to fetch patient");
  return res.json();
}

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patient");
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30"); // en minutos
  const [customDuration, setCustomDuration] = useState("");
  const [patientId, setPatientId] = useState(1);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch appointment details
        const apt = await fetchAppointment(eventId);
        setAppointment(apt);

        // Pre-fill date, time & duration
        const { date, time, duration } = parseAppointmentDate(apt.start, apt.end);
        setDate(date);
        setTime(time);
        setDuration("custom");
        setCustomDuration(duration);

        // Associated patient
        const pat = await fetchPatient(apt.patientId);
        setPatient(pat);

        // Patients list for the dropdown
        const patients = await fetchPatients();
        setPatients(patients);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadData();
    }
  }, [eventId]);

  if (!appointment || !patient) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        Appointment not found
      </div>
    );
  }

  if (whatsappLink) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Turno actualizado</h1>
        <WhatsAppLinkSuccess
          whatsappLink={whatsappLink}
          onDone={() => router.push("/appointments")}
          title="Link de WhatsApp para el paciente"
        />
      </div>
    );
  }

  // Lógica para obtener la duración final (predefinida o custom)
  const finalDuration = duration === "custom" ? Number(customDuration) : Number(duration);

  // Submit handler for updating the appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !finalDuration) {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Determine start & end datetimes
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + finalDuration * 60000);

    // Format to ISO local string without timezone (e.g. "2024-06-30T14:30")
    const formatToISO = (d: Date) => d.toLocaleString("sv").replace(" ", "T");

    const res = await fetch(`/api/appointment/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        start: formatToISO(startDateTime),
        end: formatToISO(endDateTime),
        patientId: Number(patientId),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const link = data.whatsappLink as string | undefined;
      if (link) {
        setWhatsappLink(link);
      } else {
        router.push("/appointments");
      }
    } else {
      alert("Error: " + (data?.message ?? "Error al guardar"));
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!appointment || !patient) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        Appointment not found
      </div>
    );
  }

  async function handlePatientChange(patientId: number): Promise<void> {
    setPatientId(patientId);
    const patient = await fetchPatient(patientId);
    setName(`Turno con ${patient.name} ${patient.lastname}`);
    setDescription(
      `Paciente: ${patient.name} ${patient.lastname}\n
      Teléfono: ${patient.phone}\n
      Documento: ${patient.documentId}`,
    );
  }

  return (
    <Suspense fallback={<div>{loading}</div>}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Editar Turno</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <label>
            <span className="block text-sm font-medium">Nombre del evento</span>
            <input
              type="text"
              placeholder="Turno con ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </label>

          {/* Fecha y Hora Alineados */}
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

          {/* Duración */}
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
              onChange={(e) => handlePatientChange(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            >
              <option value={0} disabled>
                Seleccione un paciente
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.lastname}
                </option>
              ))}
            </select>
          </label>

          {/* Description */}
          <label>
            <span className="block text-sm font-medium">Descripción</span>
            <textarea
              placeholder="Notas adicionales sobre el turno"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              rows={3}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </Suspense>
  );
}

function parseAppointmentDate(startStr: string, endStr: string) {
  const start = new Date(startStr);
  const end = new Date(endStr);

  const date = start.toLocaleDateString("en-CA");

  const time = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const duration = ((end.getTime() - start.getTime()) / 60000).toString();

  return { date, time, duration };
}

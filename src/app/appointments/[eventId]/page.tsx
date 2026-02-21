"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";

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

export default function InfoAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apt = await fetchAppointment(eventId);
        setAppointment(apt);
        const pat = await fetchPatient(apt.patientId);
        setPatient(pat);
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

  if (loading) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">Cargando...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">Error: {error}</div>;
  }

  if (!appointment || !patient) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        Appointment not found
      </div>
    );
  }

  // Formatear fechas
  const startDate = new Date(appointment.start).toLocaleDateString();
  const startTime = new Date(appointment.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(appointment.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Handlers para editar y eliminar
  const handleUpdate = () => {
    router.push(`/appointments/edit/${appointment.eventId}`);
  };

  const handleDelete = async () => {
    if (loading) return;

    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este turno?");

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/appointment/${appointment.eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar el turno");

      router.push("/appointments");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "No se pudo eliminar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Detalles del Turno</h1>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <p className="border rounded px-2 py-1 bg-gray-100">{startDate}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Inicia</label>
              <p className="border rounded px-2 py-1 bg-gray-100">{startTime}</p>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Finaliza</label>
              <p className="border rounded px-2 py-1 bg-gray-100">{endTime}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Paciente</label>
            <p className="border rounded px-2 py-1 bg-gray-100">
              {patient.name} {patient.lastname}
            </p>
          </div>
          <div className="h-2" /> {/* Space for a button */}
          <div className="flex gap-4">
            <div className="flex-1">
              <button
                className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold p-2.5 rounded-lg border border-indigo-200 transition-all flex items-center justify-center gap-2"
                onClick={handleUpdate}
              >
                <svg
                  xmlns="http://www.w3.org"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
            </div>
            <div className="flex-1">
              <button
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold p-2.5 rounded-lg border border-red-200 transition-all flex items-center justify-center gap-2"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

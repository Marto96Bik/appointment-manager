"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/loader";
import { Appointment, Patient } from "@prisma/client";
import { fetchAppointment } from "@/app/clients/appointment.client";
import { fetchPatient } from "@/app/clients/patient.client";
import AlertModal from "@/app/components/modals/alertModal";

export default function InfoAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const appointment = await fetchAppointment(eventId);
        setAppointment(appointment);

        const patient = await fetchPatient(appointment.patientId);
        setPatient(patient);
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

  /* Early returns */
  if (loading) {
    return <Loader />;
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
    if (!appointment) return;

    try {
      setLoading(true);

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
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Detalles del Turno</h1>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Nombre del Turno</label>
          <p className="border rounded px-2 py-1 bg-gray-100">{appointment.name}</p>
        </div>
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
        <label>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            readOnly
            value={appointment.description || "Sin descripción"}
            className="border rounded px-2 py-1 w-full"
            rows={3}
          />
        </label>
        {/* Space */}
        <div className="h-2" />
        {/* EDIT & DELETE */}
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
              onClick={() => setShowDeleteModal(true)}
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
        {/* MODAL DE ADVERTENCIA */}
        <AlertModal
          isOpen={showDeleteModal}
          title="¿Está seguro de eliminar el turno?"
          description="Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
}

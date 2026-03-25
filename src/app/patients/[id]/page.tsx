"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { patchPatientSchema } from "@/schema/patient.schema";
import Loader from "@/app/components/loader";

type PatientForm = z.infer<typeof patchPatientSchema>;

export default function InfoPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNoPatientsModal, setShowNoPatientsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<PatientForm>({
    name: "",
    lastname: "",
    phone: "",
    documentId: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const res = await fetch(`/api/patient/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        setError("Error cargando al paciente");
        return;
      }

      const data = await res.json();
      setForm({
        name: data.name,
        lastname: data.lastname,
        phone: data.phone,
        documentId: data.documentId || "",
      });
    };

    fetchPatient();
  }, [id]);

  const handleUpdate = () => {
    router.push(`/patients/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    setShowNoPatientsModal(true);

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/patient/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/patients");
    } catch (err) {
      alert("No se pudo eliminar el registro");
    } finally {
      setIsDeleting(false);
      setSelectedPatientId(null);
      setShowNoPatientsModal(false);
      setLoading(false);
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

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold text-slate-800 mb-5">
        Informacion del Paciente
      </h2>
      <div className="space-y-5">
        {/* Fullname */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <p className="text-xl text-slate-800 font-medium">
            {form.name} {form.lastname}
          </p>
        </div>
        {/* Cellphone */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Teléfono de Contacto
          </span>
          <p className="text-slate-700">{form.phone || "No especificado"}</p>
        </div>
        {/* Document */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Número de Documento
          </span>
          <p className="text-slate-700 font-mono">{form.documentId || "No especificado"}</p>
        </div>
        {/* Notifications Langague of preference */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Idioma de notoficaciones
          </span>
          <p className="text-slate-700 font-mono">{form.phone || "No especificado"}</p>
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
              onClick={() => {
                setSelectedPatientId(parseInt(id));
                setShowNoPatientsModal(true);
              }}
              disabled={isDeleting}
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

      {/* MODAL DE ADVERTENCIA */}
      {selectedPatientId && showNoPatientsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            setShowNoPatientsModal(false);
            setSelectedPatientId(null);
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Está seguro de que desea eliminar este paciente?
              </h3>
              <p className="text-gray-600 mb-5">Esta acción no se puede deshacer.</p>
              <button
                onClick={() => selectedPatientId && handleDelete(selectedPatientId)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition active:scale-95 shadow-lg shadow-red-200"
              >
                Eliminar Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

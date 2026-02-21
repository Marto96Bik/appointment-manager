"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, PlusIcon, Trash2 } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  documentId: string;
  userId: number;
}

const fetchPatients = async (): Promise<Patient[]> => {
  const res = await fetch("/api/patient");
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function PatientsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showNoPatientsModal, setShowNoPatientsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const handleDelete = async (id: number): Promise<void> => {
    setShowNoPatientsModal(true);

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/patient/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
    } catch (error) {
      alert("No se pudo eliminar el registro");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Clientes</h1>

      {isLoading ? (
        <div className="text-slate-500 animate-pulse">Cargando pacientes...</div>
      ) : patients.length > 0 ? (
        <ul className="space-y-3">
          {patients.map((p: Patient) => (
            <li
              key={p.id}
              className="group flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:shadow-md transition-all"
            >
              <Link href={`/patients/${p.id}`} className="flex-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {p.name} {p.lastname}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1">
                <Link
                  href={`/patients/${p.id}`}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </Link>
                <button
                  onClick={() => router.push(`/patients/edit/${p.id}`)}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setShowNoPatientsModal(true);
                  }}
                  disabled={isDeleting}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-10">
          <p className="text-black text-base mb-6">
            No hay pacientes cargados, agregue un paciente para visualizarlo en esta sección.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => router.push("/patients/create")}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xl transition-transform active:scale-95"
      >
        <PlusIcon size={20} />
        Añadir Paciente
      </button>

      {/* MODAL DE ADVERTENCIA */}
      {showNoPatientsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => {
            setShowNoPatientsModal(false);
            setSelectedPatientId(null); // Limpiamos el ID seleccionado
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
                onClick={() => {
                  if (selectedPatientId) {
                    handleDelete(selectedPatientId);
                    setShowNoPatientsModal(false); // Cierra el modal tras borrar
                  }
                }}
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

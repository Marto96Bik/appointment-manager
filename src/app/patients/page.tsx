"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, PlusIcon, Trash2 } from "lucide-react";
import Loader from "../components/loader";
import AlertModal from "../components/modals/alertModal";

interface Patient {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  documentId: string;
  userId: number;
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch patients on mount
  useEffect(() => {
    setLoading(true);
    const fetchPatients = async () => {
      const res = await fetch("/api/patient");

      if (!res.ok) {
        setError("Error cargando pacientes");
        return;
      }

      const data = await res.json();
      setPatients(data);
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/patient/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("No se pudo eliminar el registro");
      return;
    } finally {
      setIsDeleting(false);
      setSelectedPatientId(null);
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
    <div className="p-4 max-w-2xl mx-auto pb-32">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Pacientes</h1>

      {patients.length > 0 ? (
        <ul className="space-y-3">
          {patients.map((p) => (
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
      <AlertModal
        isOpen={!!selectedPatientId}
        title="¿Está seguro de que desea eliminar este paciente?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar Paciente"
        cancelText="Cancelar"
        onConfirm={() => selectedPatientId && handleDelete(selectedPatientId)}
        onCancel={() => {
          setSelectedPatientId(null);
        }}
      />
    </div>
  );
}

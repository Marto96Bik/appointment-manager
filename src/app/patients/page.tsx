"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function PatientsPage() {
  const {
    data: patients,
    isLoading,
    error,
  } = useQuery<Patient[], Error>({
    queryKey: ["patients"], // clave única
    queryFn: fetchPatients,
  });
  const router = useRouter();

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <ul className="space-y-2">
        {patients?.map((p) => (
          <li key={p.id}>
            <Link
              href={`/patients/${p.id}`}
              className="block p-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              {p.name} {p.lastname}
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating Button */}
      <button
        onClick={() => router.push("/patients/create")}
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
        Añadir Paciente
      </button>
    </div>
  );
}

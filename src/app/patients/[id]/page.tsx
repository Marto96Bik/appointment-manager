"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { patchPatientSchema } from "@/app/api/patient/patient.dto";

type PatientForm = z.infer<typeof patchPatientSchema>;

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<PatientForm>({
    name: "",
    lastname: "",
    phone: "",
    documentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      patchPatientSchema.parse(form);

      setLoading(true);

      const res = await fetch(`/api/patient/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error actualizando paciente");

      router.push("/patients");
    } catch (err: any) {
      setError(err.message || "Datos inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;

    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este paciente?");

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/patient/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar el paciente");

      router.push("/patients");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "No se pudo eliminar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="documentId"
          value={form.documentId}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
      <div className="h-2" /> {/* espacio fijo para el botón */}
      <button
        className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold p-2 rounded-md border border-red-200 transition-all"
        onClick={handleDelete}
      >
        Eliminar cliente
      </button>
    </div>
  );
}

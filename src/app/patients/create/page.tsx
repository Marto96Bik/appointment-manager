"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createPatientSchema } from "@/app/api/patient/patient.dto";

type PatientForm = z.infer<typeof createPatientSchema>;

export default function CreatePatientPage() {
  const [form, setForm] = useState<PatientForm>({
    name: "",
    lastname: "",
    phone: "",
    documentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      createPatientSchema.parse(form); // valida con Zod

      setLoading(true);
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error creando paciente");

      // redirige a listado de pacientes
      router.push("/patients");
    } catch (err: any) {
      setError(err.message || "Datos inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Crear Cliente</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="lastname"
          placeholder="Apellido"
          value={form.lastname}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="documentId"
          placeholder="Documento"
          value={form.documentId}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Cliente"}
        </button>
      </form>
    </div>
  );
}

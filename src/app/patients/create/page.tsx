"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createPatientSchema } from "@/schema/patient.schema";
import { COUNTRY_LIMITS } from "@/lib/phone/phone.config";
import { buildPhone } from "@/lib/phone/phone.utils";

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

  // Lógica para el prefijo telefónico (estilo Uiverse)
  const [prefix, setPrefix] = useState("+972"); // Valor por defecto
  const [isCustomPrefix, setIsCustomPrefix] = useState(false);
  const [customPrefix, setCustomPrefix] = useState("+");

  const handlePrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomPrefix(true);
    } else {
      setIsCustomPrefix(false);
      setPrefix(val);
      setForm((prev) => ({ ...prev, phone: "" })); // limpiar número al cambiar
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // 1. Solo permitir dígitos (elimina cualquier otro caracter al instante)
      let val = value.replace(/\D/g, "");

      // 2. Bloquear el "0" inicial si el usuario intenta escribirlo
      if (val.startsWith("0")) {
        val = val.substring(1);
      }

      // 3. Aplicar límite de longitud según el prefijo actual
      const activePrefix = isCustomPrefix ? "custom" : prefix;
      const limit = COUNTRY_LIMITS[activePrefix] || 15;
      if (val.length <= limit) {
        setForm({ ...form, [name]: val });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.lastname || !form.phone || !form.documentId) {
      setError("Completa todos los campos antes de guardar");
      return;
    }

    try {
      const fullPhone = buildPhone(isCustomPrefix ? customPrefix : prefix, form.phone);
      const payload = { ...form, phone: fullPhone };

      createPatientSchema.parse(payload); // valida con Zod
      setLoading(true);

      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Response handling for known errors
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.message === "Patient already exists") {
          setError("Ya existe un paciente con este documento");
        } else {
          setError("Error actualizando paciente");
        }
        return;
      }

      // Redirects after successful update
      router.push("/patients");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError("Por favor, revisa los datos del formulario");
      } else {
        setError(err.message || "Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">Crear Paciente</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Campo: Nombre */}
        <div className="w-full">
          <label className="text-gray-600 text-sm font-semibold ml-1">Nombre</label>
          <div className="relative mt-2 text-gray-500">
            <input
              name="name"
              type="text"
              placeholder="Ej. Juan"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 appearance-none bg-transparent outline-none border focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-sm rounded-lg transition-all"
              required
            />
          </div>
        </div>

        {/* Campo: Apellido */}
        <div className="w-full">
          <label className="text-gray-600 text-sm font-semibold ml-1">Apellido</label>
          <div className="relative mt-2 text-gray-500">
            <input
              name="lastname"
              type="text"
              placeholder="Ej. Pérez"
              value={form.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2.5 appearance-none bg-transparent outline-none border focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-sm rounded-lg transition-all"
              required
            />
          </div>
        </div>

        {/* Campo: Teléfono (Estilo Uiverse adaptado) */}
        <div className="w-full">
          <label className="text-gray-600 text-sm font-semibold ml-1">Número de teléfono</label>
          <div className="relative mt-2 text-gray-500">
            <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r border-gray-200 pr-2">
              {!isCustomPrefix ? (
                <select
                  value={prefix}
                  onChange={handlePrefixChange}
                  className="text-xs outline-none rounded-lg h-full bg-transparent cursor-pointer font-bold text-blue-600"
                >
                  <option value="+972">IL +972</option>
                  <option value="+54">AR +54</option>
                  <option value="+34">ES +34</option>
                  <option value="+1">US +1</option>
                  <option value="+52">MX +52</option>
                  <option value="custom">Otro..</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) => {
                    setCustomPrefix(e.target.value);
                    setForm((prev) => ({ ...prev, phone: "" })); // limpia el número al cambiar custom
                  }}
                  className="w-10 text-xs font-bold text-blue-600 outline-none bg-transparent"
                />
              )}
            </div>
            <input
              name="phone"
              type="text" // Usamos text con inputMode para mejor control del filtro
              inputMode="numeric"
              placeholder={prefix === "+972" ? "50 266 9713" : "Número local"}
              value={form.phone}
              onChange={handleChange}
              className={`${isCustomPrefix ? "pl-16" : "pl-24"} w-full pr-3 py-2.5 appearance-none bg-transparent outline-none border focus:border-blue-600 shadow-sm rounded-lg transition-all font-sans`}
              required
            />
          </div>
          <p className="mt-1 text-[10px] text-gray-400 ml-1">
            * Ingrese el número directamente sin el "0" inicial.
          </p>
        </div>

        {/* Campo: Documento */}
        <div className="w-full">
          <label className="text-gray-600 text-sm font-semibold ml-1">Documento de Identidad</label>
          <div className="relative mt-2 text-gray-500">
            <input
              name="documentId"
              type="text"
              placeholder="T.Z., DNI, NIE o Pasaporte"
              value={form.documentId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 appearance-none bg-transparent outline-none border focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-sm rounded-lg transition-all"
            />
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando...
            </span>
          ) : (
            "Crear Paciente"
          )}
        </button>
      </form>
    </div>
  );
}

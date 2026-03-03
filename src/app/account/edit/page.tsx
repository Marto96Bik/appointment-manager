"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { updateUserSchema } from "@/shared/schemas/user.schema";
import { COUNTRY_LIMITS, KNOWN_PREFIXES } from "@/shared/phone/phone.config";
import { buildPhone, splitPhone } from "@/shared/phone/phone.utils";
type UserForm = z.infer<typeof updateUserSchema>;

export default function EditAccountPage() {
  const router = useRouter();

  const [form, setForm] = useState<UserForm>({
    name: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States for phone prefix handling
  const [isCustomPrefix, setIsCustomPrefix] = useState(false);
  const [customPrefix, setCustomPrefix] = useState("+");
  type KnownPrefix = (typeof KNOWN_PREFIXES)[number] | "custom";
  const [prefix, setPrefix] = useState<KnownPrefix>("+972");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setError("Error cargando datos");
        return;
      }

      const data = await res.json();
      // Split prefix and local number for form handling
      const { prefix: detectedPrefix, localNumber, isCustom } = splitPhone(data.phone);
      setForm({
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: localNumber,
      });

      if (isCustom) {
        setIsCustomPrefix(true);
        setCustomPrefix(detectedPrefix);
        setPrefix("+972"); // default fallback number
      } else {
        setIsCustomPrefix(false);
        setPrefix(detectedPrefix as KnownPrefix);
        setCustomPrefix("+"); // Custom input reset
      }
    };

    fetchUser();
  }, []);

  const handlePrefixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as KnownPrefix;
    if (val === "custom") {
      setIsCustomPrefix(true);
      setForm((prev) => ({ ...prev, phone: "" }));
    } else {
      setIsCustomPrefix(false);
      setPrefix(val);
      setForm((prev) => ({ ...prev, phone: "" }));
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

    if (!form.name || !form.lastname || !form.phone) {
      setError("Completa todos los campos antes de guardar");
      return;
    }

    try {
      const fullPhone = buildPhone(isCustomPrefix ? customPrefix : prefix, form.phone);
      const payload = { ...form, phone: fullPhone };

      updateUserSchema.parse(payload);

      setLoading(true);

      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error actualizando datos");

      router.push("/account");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError("Revisa los datos ingresados");
      } else {
        setError(err.message || "Error actualizando datos de usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">Editar Cuenta</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Name */}
        <div>
          <label className="text-gray-600 text-sm font-semibold ml-1">Nombre</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Lastname */}
        <div>
          <label className="text-gray-600 text-sm font-semibold ml-1">Apellido</label>
          <input
            name="lastname"
            value={form.lastname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-gray-600 text-sm font-semibold ml-1">Email</label>
          <input
            name="email"
            value={form.email || ""}
            disabled
            className="w-full px-4 py-2.5 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Phone */}
        <div className="w-full">
          <label className="text-gray-600 text-sm font-semibold ml-1">Número de teléfono</label>
          <div className="relative mt-2 text-gray-500">
            <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r border-gray-200 pr-2">
              {!isCustomPrefix ? (
                <select
                  value={prefix}
                  onChange={handlePrefixChange} // <- acá usamos la función central
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
                    setForm((prev) => ({ ...prev, phone: "" })); // limpia el número si cambia custom
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
            "Guardar Cambios"
          )}
        </button>
      </form>
    </div>
  );
}

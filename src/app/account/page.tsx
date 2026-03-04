"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setError("Error cargando la cuenta");
        return;
      }

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  const handleUpdate = () => {
    router.push("/account/edit");
  };

  const handleDelete = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      router.push("/login");
      const res = await fetch("/api/user/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error eliminando la cuenta");
    } catch (err: any) {
      setError(err.message || "No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold text-slate-800 mb-5">Mi Cuenta</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Fullname */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <p className="text-xl text-slate-800 font-medium">
            {user.name} {user.lastname}
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
          <p className="text-slate-700">{user.email}</p>
        </div>

        {/* Phone */}
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Teléfono
          </span>
          <p className="text-slate-700">{user.phone || "No especificado"}</p>
        </div>

        <div className="h-2" />

        <div className="flex gap-4">
          <div className="flex-1">
            <button
              className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold p-2.5 rounded-lg border border-indigo-200 transition-all flex items-center justify-center gap-2"
              onClick={handleUpdate}
            >
              Editar
            </button>
          </div>

          <div className="flex-1">
            <button
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold p-2.5 rounded-lg border border-red-200 transition-all flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import NotificationBell from "./notificationBell";

export default function Header() {
  const router = useRouter();
  return (
    <div className="w-full h-18 bg-cyan-700 shadow flex items-center justify-center relative">
      {/* Title */}
      <button
        className="text-2xl text-white font-semibold hover:text-slate-300 transition-colors"
        onClick={() => router.push("/appointments")}
      >
        Administrador de Turnos
      </button>

      {/* Notificacion Bell */}
      <div className="absolute right-4">
        <NotificationBell />
      </div>
    </div>
  );
}

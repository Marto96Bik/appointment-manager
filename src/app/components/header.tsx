"use client";

import NotificationBell from "./notificationBell";

export default function Header() {
  return (
    <div className="w-full h-18 bg-white shadow flex items-center justify-center relative">
      {/* Title */}
      <h1 className="text-2xl font-semibold">Administrador de Turnos</h1>

      {/* Notificacion Bell */}
      <div className="absolute right-4">
        <NotificationBell />
      </div>
    </div>
  );
}

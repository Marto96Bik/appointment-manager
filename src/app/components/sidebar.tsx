"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Botón hamburguesa, solo visible si el sidebar está cerrado */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded shadow-md hover:bg-gray-100 transition-opacity duration-300"
          onClick={() => setOpen(true)}
        >
          &#9776; {/* Tres barras */}
        </button>
      )}

      {/* Sidebar deslizante */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-6">Appointment Manager</h2>
          <button
            className="text-left px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => {
              router.push("/appointments");
              setOpen(false);
            }}
          >
            Inicio
          </button>
          <button
            className="text-left px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => {
              router.push("/patients");
              setOpen(false);
            }}
          >
            Clientes
          </button>
        </div>

        {/* Logout abajo */}
        <div className="p-6 mt-auto">
          <button
            className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600"
            onClick={() => {
              router.push("/logout");
              setOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Fondo semi-transparente al abrir, clic para cerrar */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-30 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

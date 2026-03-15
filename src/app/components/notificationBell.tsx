"use client";

import { useState, useRef, useEffect } from "react";
import { WhatsAppLinkSuccess } from "./whatsapp-link-success";
import router from "next/router";

interface Reminder {
  id: number;
  patientFullName: string;
  start: string;
  whatsappLink: string;
  eventId: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  async function loadReminders() {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders");

      if (!res.ok) return;

      const data = await res.json();
      setReminders(data);
    } catch (err) {
      setError("Error loading reminders");
    } finally {
      setLoading(false);
    }
  }

  // Pooling reminders every 60 seconds
  useEffect(() => {
    loadReminders();

    const interval = setInterval(() => {
      loadReminders();
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotify = async (reminder: Reminder) => {
    if (submitting) return; // Prevent double submission
    setSubmitting(true);

    try {
      const res = await fetch(`/api/reminders/${reminder.eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const link = data.whatsappLink as string | undefined;
        if (link) {
          setWhatsappLink(link);
        } else {
          setError(
            "Error al redirigir al enlace de WhatsApp. Por favor avise al paciente manualmente.",
          );
        }
      } else {
        alert("Error: " + (data?.message ?? "Error al notificar"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
    </div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">Error: {error}</div>;
  }

  if (whatsappLink) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Turno creado</h1>
        <WhatsAppLinkSuccess
          whatsappLink={whatsappLink}
          onDone={() => router.push("/appointments")}
          title="Link de WhatsApp para el paciente"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer p-3 bg-white text-black hover:bg-gray-200 shadow rounded-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {reminders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {reminders.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-xl border z-50">
          <div className="p-3 font-semibold border-b">Recordatorios</div>

          {reminders.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No hay recordatorios</div>
          ) : (
            reminders.map((reminder) => (
              <button
                key={reminder.id}
                onClick={() => {
                  handleNotify(reminder);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-none"
              >
                <div className="font-medium">{reminder.patientFullName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(reminder.start).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

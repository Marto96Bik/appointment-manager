"use client";

import { useMemo } from "react";
import { CheckCheck } from "lucide-react";

const WA_LINK_BASE = "https://wa.link/";

/** Ensures we always use an absolute wa.link URL so the link opens WhatsApp instead of our app. */
function toAbsoluteWaLink(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${WA_LINK_BASE}${path}`;
}

type Props = Readonly<{
  whatsappLink: string;
  onDone: () => void;
  title?: string;
}>;

export function WhatsAppLinkSuccess({ whatsappLink, onDone, title }: Props) {
  const absoluteLink = useMemo(() => toAbsoluteWaLink(whatsappLink), [whatsappLink]);

  return (
    <div className="border-green-200 bg-green-50 shadow-sm border border-slate-200 rounded-xl p-7">
      <h3 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CheckCheck color="#53de13" size={30} />
        <span>{title ?? "Avisá al paciente por WhatsApp"}</span>
      </h3>

      <p className="text-sm text-slate-800">
        Se ha generado un link de WhatsApp para que puedas avisar al paciente sobre su turno.
      </p>
      <div className="space-y-4">
        <div className="space-y-4" />
        <div className="flex flex-col gap-2">
          <form action={absoluteLink} target="_blank" method="get" className="sm:flex-1">
            <button
              type="submit"
              className="w-full text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              WhatsApp
            </button>
          </form>

          <button
            type="button"
            onClick={onDone}
            className="w-full text-sm py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition sm:flex-1"
          >
            Volver a turnos
          </button>
        </div>
      </div>
    </div>
  );
}

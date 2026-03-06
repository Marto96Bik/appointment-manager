"use client";

import { useState, useMemo } from "react";

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
  const [copied, setCopied] = useState(false);
  const absoluteLink = useMemo(() => toAbsoluteWaLink(whatsappLink), [whatsappLink]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(absoluteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="text-sm font-semibold text-green-800 mb-2">
        {title ?? "Link de WhatsApp generado"}
      </h3>
      <p className="text-xs text-green-700 mb-2">
        Compartí este link con el paciente para que reciba el mensaje por WhatsApp.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <form action={absoluteLink} target="_blank" method="get" className="contents">
          <button
            type="submit"
            className="text-blue-600 hover:underline text-sm break-all text-left cursor-pointer bg-transparent border-0 p-0"
          >
            {absoluteLink}
          </button>
        </form>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="text-sm px-3 py-1.5 rounded border border-green-600 text-green-700 hover:bg-green-100 transition-colors"
        >
          {copied ? "Copiado" : "Copiar link"}
        </button>
        <form action={absoluteLink} target="_blank" method="get" className="inline-block">
          <button
            type="submit"
            className="text-sm px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 transition-colors w-full"
          >
            Abrir WhatsApp
          </button>
        </form>
      </div>
      <button
        type="button"
        onClick={onDone}
        className="mt-3 w-full text-sm py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
      >
        Volver a turnos
      </button>
    </div>
  );
}

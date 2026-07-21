"use client";

import { useState } from "react";
import Image from "next/image";
import ChamferOutline from "./ChamferOutline";
import { chamferClipPath } from "./chamfer";

type Status = "idle" | "loading" | "success" | "error";

const WHATSAPP_NUMBER = "543585103001";

export default function Footer() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ email: "", phone: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer id="contacto" className="relative overflow-hidden bg-[var(--parta-blue)]">
      <div className="relative z-10 px-6 pb-32 pt-24 md:px-14 md:pb-40 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Contacto</p>
          <h2 className="mt-3 text-2xl font-bold uppercase leading-tight text-white sm:text-3xl md:text-4xl">
            Para más información,
            <br />
            contactanos llenando el formulario.
          </h2>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ChamferOutline variant="form" cut={9}>
                <input
                  type="email"
                  required
                  placeholder="E-MAIL"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-transparent px-5 py-4 text-sm tracking-widest text-white placeholder-white/70 placeholder:uppercase outline-none"
                />
              </ChamferOutline>
              <ChamferOutline variant="form" cut={9}>
                <input
                  type="tel"
                  placeholder="TELÉFONO"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-transparent px-5 py-4 text-sm tracking-widest text-white placeholder-white/70 placeholder:uppercase outline-none"
                />
              </ChamferOutline>
            </div>

            <ChamferOutline variant="form" cut={9}>
              <textarea
                placeholder="DESCRIPCIÓN"
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full resize-none bg-transparent px-5 py-4 text-sm tracking-widest text-white placeholder-white/70 placeholder:uppercase outline-none"
              />
            </ChamferOutline>

            <div className="flex items-center justify-end gap-4 pt-2">
              {status === "success" && (
                <p className="text-sm text-white">¡Gracias! Te vamos a contactar a la brevedad.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-200">Ocurrió un error. Probá de nuevo.</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-heading bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-[var(--parta-blue)] transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ clipPath: chamferClipPath("form", 9) }}
              >
                {status === "loading" ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Wordmark gigante de fondo */}
      <div className="relative z-0 select-none px-4">
        <Image
          src="/logo-white.svg"
          alt=""
          aria-hidden
          width={753}
          height={140}
          className="h-auto w-full opacity-90"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 px-6 py-12 text-white md:flex-row md:items-end md:justify-between md:px-14 md:py-16">
        <p className="text-xs uppercase leading-relaxed tracking-widest text-white/80">
          Parque Logístico
          <br />
          Industrial
        </p>
        <p className="text-xs uppercase leading-relaxed tracking-widest text-white/80">
          Ruta A005 y Unión de los Argentinos - Río Cuarto, Cba.
          <br />
          info@parta.com.ar - +54 9 3582 40-6648
        </p>
        <div id="social-links" className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/parta.arg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/parta-arg/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <mask id="linkedin-badge-mask">
                <rect x="0" y="0" width="24" height="24" rx="5" fill="white" />
                <path
                  fill="black"
                  transform="translate(4 3.5) scale(0.71)"
                  d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.5V23H.24V8.25ZM8.5 8.25h4.31v2.01h.06c.6-1.13 2.06-2.33 4.24-2.33 4.53 0 5.37 2.98 5.37 6.86V23h-4.5v-6.44c0-1.54-.03-3.51-2.14-3.51-2.15 0-2.48 1.68-2.48 3.4V23H8.5V8.25Z"
                />
              </mask>
              <rect x="0" y="0" width="24" height="24" rx="5" fill="currentColor" mask="url(#linkedin-badge-mask)" />
            </svg>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-5 w-5 items-center justify-center text-white transition-opacity hover:opacity-70"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.25 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

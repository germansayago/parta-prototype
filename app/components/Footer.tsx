"use client";

import { useState } from "react";
import Image from "next/image";
import ChamferOutline from "./ChamferOutline";
import { chamferClipPath } from "./chamfer";

type Status = "idle" | "loading" | "success" | "error";

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
      <div className="relative z-10 px-6 pt-6 md:px-14 md:pt-8">
        <div className="flex items-start justify-between">
          <a href="/" className="block">
            <Image src="/logo-white.webp" alt="PARTA" width={140} height={26} />
          </a>
          <a href="#contacto">
            <ChamferOutline variant="nav" cut={14} innerClassName="flex items-center px-5 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-white">
                Contacto
              </span>
            </ChamferOutline>
          </a>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-20 pt-16 md:px-14 md:pb-28 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Contacto</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-5xl">
          Para más información, contactanos llenando el formulario.
        </h2>

        <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChamferOutline variant="form" cut={14}>
              <input
                type="email"
                required
                placeholder="E-MAIL"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent px-5 py-4 text-sm uppercase tracking-widest text-white placeholder-white/70 outline-none"
              />
            </ChamferOutline>
            <ChamferOutline variant="form" cut={14}>
              <input
                type="tel"
                placeholder="TELÉFONO"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full bg-transparent px-5 py-4 text-sm uppercase tracking-widest text-white placeholder-white/70 outline-none"
              />
            </ChamferOutline>
          </div>

          <ChamferOutline variant="form" cut={14}>
            <textarea
              placeholder="DESCRIPCIÓN"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full resize-none bg-transparent px-5 py-4 text-sm uppercase tracking-widest text-white placeholder-white/70 outline-none"
            />
          </ChamferOutline>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-[var(--parta-blue)] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ clipPath: chamferClipPath("form", 14) }}
            >
              {status === "loading" ? "Enviando..." : "Enviar"}
            </button>
            {status === "success" && (
              <p className="text-sm text-white">¡Gracias! Te vamos a contactar a la brevedad.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-200">Ocurrió un error. Probá de nuevo.</p>
            )}
          </div>
        </form>
      </div>

      {/* Wordmark gigante de fondo */}
      <div className="relative z-0 -mt-8 select-none px-4 md:-mt-16">
        <Image
          src="/logo-white.webp"
          alt=""
          aria-hidden
          width={753}
          height={140}
          className="h-auto w-full opacity-90"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 border-t border-white/15 px-6 py-8 text-white md:flex-row md:items-end md:justify-between md:px-14">
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
        <div className="flex gap-3">
          <a
            href="#"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center border border-white/40 text-white transition-colors hover:bg-white hover:text-[var(--parta-blue)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center border border-white/40 text-white transition-colors hover:bg-white hover:text-[var(--parta-blue)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.5V23H.24V8.25ZM8.5 8.25h4.31v2.01h.06c.6-1.13 2.06-2.33 4.24-2.33 4.53 0 5.37 2.98 5.37 6.86V23h-4.5v-6.44c0-1.54-.03-3.51-2.14-3.51-2.15 0-2.48 1.68-2.48 3.4V23H8.5V8.25Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

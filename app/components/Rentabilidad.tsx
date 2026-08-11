import { Fragment } from "react";
import Image from "next/image";
import { chamferClipPath } from "./chamfer";

// Sección nueva, no estaba en el rediseño del navbar/diseño original. Diseño
// definitivo llegó en 2 vueltas: primero solo una foto vertical de brochure
// (sin asset dedicado a desktop), después el cliente pasó el diseño final
// completo con fondo propio por breakpoint (designs/rentabilidad/
// rentabilidad-{bg,muestra}-{desktop,mobile}.webp) — mismo patrón que
// Servicios/Inversiones (dos <Image>, no un solo asset recortado con CSS).
//
// A diferencia de los bloques-foto de Servicios/Inversiones (título+bajada
// ancladas ABAJO), acá el contenido va arriba, sobre el cielo de la foto —
// confirmado en el mockup, no asumido.
// 3 arriba + 2 abajo, tal cual el mockup — filas fijas (no wrap natural según
// ancho disponible) para no depender de cuánto entra en cada línea. Cada
// beneficio son 2 líneas manuales (mismo patrón que los títulos de
// Servicios/Inversiones), no un salto automático del navegador — el mockup
// corta cada uno en un punto específico, no donde el texto alcance a entrar.
const BENEFICIOS_FILA_1: string[][] = [
  ["Exención de", "ingresos brutos"],
  ["Beneficios", "municipales"],
  ["Menores costos", "operativos"],
];
const BENEFICIOS_FILA_2: string[][] = [
  ["Infraestructura", "compartida"],
  ["Incentivos vinculados", "a la radicación industrial"],
];

function BeneficioLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export default function Rentabilidad() {
  return (
    <section id="rentabilidad" className="relative w-full scroll-mt-20 bg-black md:scroll-mt-24">
      <div className="relative aspect-[1080/1920] w-full md:aspect-[1920/2000]">
        <Image
          src="/images/rentabilidad-bg-mobile.webp"
          alt=""
          fill
          className="object-cover object-top md:hidden"
          sizes="(max-width: 767px) 100vw, 0px"
        />
        <Image
          src="/images/rentabilidad-bg-desktop.webp"
          alt=""
          fill
          className="hidden object-cover md:block"
          sizes="(min-width: 768px) 100vw, 0px"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-start px-6 pt-12 md:px-14 md:pt-40">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* Título centrado en mobile, alineado a la izquierda en desktop — así en los 2 mockups. */}
            <h2 className="font-heading text-center text-3xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-9xl md:leading-[0.8]">
              Una decisión
              <br />
              que impacta en
              <br />
              la rentabilidad.
            </h2>

            {/* Bajada centrada en los 2 breakpoints (a diferencia del título en desktop) — así está en el mockup. */}
            <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-[1.1] text-white md:text-lg">
              La radicación dentro de PARTA® permite acceder a beneficios que contribuyen
              directamente a mejorar la competitividad empresarial.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-nowrap justify-center gap-1.5 md:flex-wrap md:gap-4">
                {BENEFICIOS_FILA_1.map((beneficio) => (
                  <span
                    key={beneficio.join(" ")}
                    className="font-heading bg-[#3555fa] px-2 py-2 text-center text-[12px] leading-tight font-bold tracking-normal text-white uppercase md:px-8 md:py-5 md:text-base md:leading-normal md:tracking-wide"
                    style={{ clipPath: chamferClipPath("nav", 12) }}
                  >
                    <BeneficioLines lines={beneficio} />
                  </span>
                ))}
              </div>
              <div className="flex flex-nowrap justify-center gap-1.5 md:flex-wrap md:gap-4">
                {BENEFICIOS_FILA_2.map((beneficio) => (
                  <span
                    key={beneficio.join(" ")}
                    className="font-heading bg-[#3555fa] px-2 py-2 text-center text-[10px] leading-tight font-bold tracking-normal text-white uppercase md:px-8 md:py-5 md:text-base md:leading-normal md:tracking-wide"
                    style={{ clipPath: chamferClipPath("nav", 12) }}
                  >
                    <BeneficioLines lines={beneficio} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

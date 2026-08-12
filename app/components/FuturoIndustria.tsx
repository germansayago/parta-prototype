import { Fragment } from "react";
import Image from "next/image";

// Bloque de cierre "Sé parte del futuro de la industria y la logística." —
// vivía como bloque 3 de Inversiones.tsx (mismos assets, sin cambios), se
// separó a su propio componente y se movió entre Rentabilidad y Footer a
// pedido del cliente (2026-08-11), sin tocar el resto de Inversiones.
const HEADING_SCALE =
  "font-heading text-4xl leading-[0.9] font-bold tracking-tighter text-white uppercase md:text-9xl md:leading-[0.8]";

function HeadingLines({ lines }: { lines: string[] }) {
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

export default function FuturoIndustria() {
  return (
    <section id="futuro-industria" className="relative w-full scroll-mt-20 bg-black md:scroll-mt-24">
      <div className="relative aspect-[1080/1921] w-full md:aspect-[1921/1780]">
        <Image
          src="/images/inversiones-3-bg-mobile.webp"
          alt=""
          fill
          className="object-cover md:hidden"
          sizes="(max-width: 767px) 100vw, 0px"
        />
        <Image
          src="/images/inversiones-3-bg-desktop.webp"
          alt=""
          fill
          className="hidden object-cover md:block"
          sizes="(min-width: 768px) 100vw, 0px"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-16 text-center md:px-14 md:pb-24 md:text-left">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className={`${HEADING_SCALE} mt-20 text-center md:mt-32`}>
              <HeadingLines lines={["Sé parte del futuro", "de la industria y", "la logística."]} />
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

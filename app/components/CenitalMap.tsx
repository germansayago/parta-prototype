import CenitalMapDesktop from "./CenitalMapDesktop";
import CenitalMapMobile from "./CenitalMapMobile";
import { LOTES, type Lote } from "../data/lotes";

export default function CenitalMap({ lotes = LOTES }: { lotes?: Lote[] }) {
  // El id vive en este wrapper (no en las <section> de cada variante): esas
  // quedan una con "hidden md:block" y otra con "md:hidden", así que solo una
  // está realmente visible/con layout en cada breakpoint — poner el mismo id
  // en las dos generaría un id duplicado en el DOM y document.querySelector
  // siempre devolvería la primera (la desktop), rota en mobile porque un
  // elemento display:none no tiene bounding box real para calcular el scroll.
  return (
    <div id="lotes" className="scroll-mt-20 md:scroll-mt-24">
      <div className="hidden md:block">
        <CenitalMapDesktop lotes={lotes} />
      </div>
      <div className="md:hidden">
        <CenitalMapMobile lotes={lotes} />
      </div>
    </div>
  );
}

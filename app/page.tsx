import Hero from "./components/Hero";
import DescripcionGeneral from "./components/DescripcionGeneral";
// import VideoZoom from "./components/VideoZoom"; // oculto a pedido del cliente (2026-08-10), ver Sección 3 más abajo
import IsometricMap from "./components/IsometricMap";
import CenitalMap from "./components/CenitalMap";
import Servicios from "./components/Servicios";
import Inversiones from "./components/Inversiones";
import Rentabilidad from "./components/Rentabilidad";
import SmoothScroll from "./components/SmoothScroll";
import Footer from "./components/Footer";
import { mergeLoteOverrides } from "./data/lotes";
import { fetchLoteOverrides } from "./lib/sheet";

export default async function Home() {
  const loteOverrides = await fetchLoteOverrides();
  const lotes = mergeLoteOverrides(loteOverrides);

  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con slider de fondos */}
      <Hero />

      {/* Sección 2: Descripción general del proyecto */}
      <DescripcionGeneral />

      {/* Sección 3: Video zoom-in al scroll — oculta a pedido del cliente (2026-08-10),
          componente sigue existiendo en ./components/VideoZoom.tsx por si se reactiva */}

      {/* Sección 4: Mapa cenital de loteo */}
      <CenitalMap lotes={lotes} />

      {/* Sección 5: Mapa isométrico interactivo */}
      <IsometricMap />

      {/* Sección 6: Servicios (3 bloques full-bleed) */}
      <Servicios />

      {/* Sección 7: Inversores */}
      <Inversiones />

      {/* Sección 8: Rentabilidad (no estaba en el diseño original, agregada 2026-08-11) */}
      <Rentabilidad />

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}

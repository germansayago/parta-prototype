import VideoZoom from "./components/VideoZoom";
import IsometricMap from "./components/IsometricMap";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con video zoom-in al scroll */}
      <VideoZoom />

      {/* Sección 2: Mapa isométrico interactivo */}
      <IsometricMap />

      {/* Placeholder resto del sitio */}
      <section className="h-screen flex items-center justify-center bg-black border-t border-white/10">
        <div className="text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Próximas secciones</p>
          <h2 className="text-4xl font-bold text-white/20 uppercase">Quiénes somos · Inversores · Contacto</h2>
        </div>
      </section>
    </main>
    </SmoothScroll>
  );
}

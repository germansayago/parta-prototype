import Hero from "./components/Hero";
import IsometricMap from "./components/IsometricMap";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
    <main>
      {/* Sección 1: Hero con slider de fondos */}
      <Hero />

      {/* Sección 2: Mapa isométrico interactivo */}
      <IsometricMap />

      {/* Placeholder resto del sitio */}
      <section className="h-screen flex items-center justify-center bg-black border-t border-white/10">
        <div className="text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Próximas secciones</p>
          <h2 className="text-4xl font-bold text-white/20 uppercase">Quiénes somos · Inversores</h2>
        </div>
      </section>

      {/* Footer con formulario de contacto */}
      <Footer />
    </main>
    </SmoothScroll>
  );
}

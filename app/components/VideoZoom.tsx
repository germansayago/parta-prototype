"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/video/video-zoom-in.mp4";
const TOTAL_FRAMES = 96;
const FRAMES_BASE_URL = "/video/frames";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function drawCover(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const x = (cw - iw * scale) / 2;
  const y = (ch - ih * scale) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, x, y, iw * scale, ih * scale);
}

export default function VideoZoom() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [ios, setIos] = useState(false);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    setIos(isIOS());
  }, []);

  // Precargar frames para iOS
  useEffect(() => {
    if (!ios) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let settledCount = 0;
    const images: HTMLImageElement[] = Array(TOTAL_FRAMES);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      const done = (ok: boolean) => {
        if (ok) images[i - 1] = img;
        settledCount++;
        setLoadProgress(Math.round((settledCount / TOTAL_FRAMES) * 100));
        // Dibujar el primer frame apenas esté disponible
        if (i === 1 && ok) {
          const ctx = canvas.getContext("2d");
          if (ctx) drawCover(canvas, ctx, img);
        }
        // No colgar el loader si algún frame falla: seguimos con los que cargaron
        if (settledCount === TOTAL_FRAMES) {
          framesRef.current = images;
          setFramesLoaded(true);
          const first = images.find(Boolean);
          const ctx = canvas.getContext("2d");
          if (ctx && first) drawCover(canvas, ctx, first);
        }
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = `${FRAMES_BASE_URL}/frame_${num}.jpg`;
    }
  }, [ios]);

  // Scroll handler para ambas versiones
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    if (!wrapper || !sticky) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      if (ios) {
        const canvas = canvasRef.current;
        if (!canvas || framesRef.current.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
        const img = framesRef.current[frameIndex];
        if (img) drawCover(canvas, ctx, img);
      } else {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        video.currentTime = progress * video.duration;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ios, framesLoaded]);

  return (
    // Wrapper alto = espacio de scroll (300vh = 3 "pantallas" de scroll)
    <div ref={wrapperRef} style={{ height: "300vh" }}>
      {/* Sticky: se queda fijo mientras scrolleás dentro del wrapper */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
      >
        {ios ? (
          <>
            {/* Loader de progreso */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black transition-opacity duration-700"
              style={{ opacity: framesLoaded ? 0 : 1, pointerEvents: framesLoaded ? "none" : "auto" }}
            >
              <p className="text-white/40 text-xs tracking-widest uppercase mb-6">Cargando</p>
              <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-200"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="text-white/30 text-xs mt-3">{loadProgress}%</p>
            </div>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
          />
        )}

        {/* Overlay de texto — layout de designs/demo-video-zoom.webp: título
            grande blanco alineado a la izquierda + bajada debajo. Los saltos
            de línea del título son fijos, a pedido, para replicar la muestra. */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-14 lg:px-20">
          <h1 className="font-heading text-4xl leading-[0.9] font-bold tracking-tighter uppercase sm:text-5xl md:text-7xl lg:text-8xl">
            Ubicado<br />
            en el núcleo<br />
            logístico y<br />
            productivo<br />
            de Argentina.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white md:mt-8 md:max-w-2xl md:text-base">
            Ubicado estratégicamente en Río Cuarto, PARTA se proyecta como un nuevo nodo
            industrial y logístico en el centro del país. Su conectividad con rutas nacionales,
            corredores productivos y principales centros urbanos lo convierte en un punto clave
            para el movimiento de mercadería, operaciones industriales y desarrollo empresarial.
            Una ubicación pensada para acercar producción, infraestructura y oportunidades en una
            de las regiones con mayor potencial de crecimiento de Argentina.
          </p>
        </div>
      </div>
    </div>
  );
}

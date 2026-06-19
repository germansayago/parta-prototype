"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "https://cdn.germansayago.dev/varios_clientes/hero-scrub-lg-seekable.mp4";
const TOTAL_FRAMES = 96;
const FRAMES_BASE_URL = "https://cdn.germansayago.dev/varios_clientes/frames";

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

    let loadedCount = 0;
    const images: HTMLImageElement[] = Array(TOTAL_FRAMES);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `${FRAMES_BASE_URL}/frame_${num}.jpg`;
      img.onload = () => {
        images[i - 1] = img;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = images;
          setFramesLoaded(true);
          const ctx = canvas.getContext("2d");
          if (ctx) drawCover(canvas, ctx, images[0]);
        }
      };
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
            {!framesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-white/30 text-sm tracking-widest uppercase">Cargando...</p>
              </div>
            )}
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

        {/* Overlay de texto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8">
          <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">
            Río Cuarto · Córdoba · Argentina
          </p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase leading-tight mb-6">
            Bienvenido al<br />
            <span style={{ color: "#2563eb" }}>Corazón Logístico</span><br />
            de Argentina
          </h1>
          <div className="flex gap-4 mt-4">
            <button className="border border-white text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-colors">
              Descargá el Brochure
            </button>
            <button className="bg-blue-600 text-white text-sm uppercase tracking-widest px-6 py-3 hover:bg-blue-700 transition-colors">
              Solicitar Información
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

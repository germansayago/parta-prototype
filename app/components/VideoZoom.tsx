"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "https://cdn.germansayago.dev/varios_clientes/hero-scrub-lg-seekable.mp4";
const TOTAL_FRAMES = 96;
const FRAMES_BASE_URL = "https://cdn.germansayago.dev/varios_clientes/frames";

function drawFrame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
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

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

// Componente canvas para iOS
function CanvasScrub({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Precargar todos los frames
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `${FRAMES_BASE_URL}/frame_${num}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = images;
          setLoaded(true);
          drawFrame(canvas, ctx, images[0]);
        }
      };
      images.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !sectionRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajustar canvas al tamaño de pantalla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * TOTAL_FRAMES)
        );
        const img = framesRef.current[frameIndex];
        if (img) drawFrame(canvas, ctx, img);
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [loaded, sectionRef]);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <p className="text-white/30 text-sm tracking-widest uppercase">Cargando...</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: loaded ? 1 : 0, width: "100%", height: "100%" }}
      />
    </>
  );
}

// Componente video para desktop
function VideoScrub({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const setup = () => {
      const duration = video.duration || 6.4;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          video.currentTime = self.progress * duration;
        },
      });
    };

    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [sectionRef]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  );
}

export default function VideoZoom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-black overflow-hidden">
      {ios ? (
        <CanvasScrub sectionRef={sectionRef} />
      ) : (
        <VideoScrub sectionRef={sectionRef} />
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
    </section>
  );
}

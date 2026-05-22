"use client";

import { useEffect, useRef } from "react";

/**
 * Antigravity-style "digital lava lamp" — LIGHT theme. Soft brand-tinted gradient
 * orbs drift on lazy sine paths over a white→pale-blue canvas, tinting it into
 * gentle pastel washes (source-over, since `lighter` washes out on white).
 *
 * Perf guards: DPR capped at 1.5, fewer orbs on phones, pauses while hidden,
 * static single frame under prefers-reduced-motion.
 */

type Orb = {
  r: number;
  hueA: string;
  hueB: string;
  ox: number;
  oy: number;
  sx: number;
  sy: number;
  phase: number;
};

const PALETTE: Array<[string, string]> = [
  ["rgba(90,120,255,0.30)", "rgba(90,120,255,0)"], // royal blue
  ["rgba(255,196,0,0.22)", "rgba(255,196,0,0)"], // brand gold
  ["rgba(120,180,255,0.28)", "rgba(120,180,255,0)"], // sky blue
  ["rgba(160,130,255,0.18)", "rgba(160,130,255,0)"], // soft violet
  ["rgba(255,224,138,0.20)", "rgba(255,224,138,0)"], // pale gold
];

export default function AbstractBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let orbs: Orb[] = [];
    let raf = 0;
    let running = true;

    const buildOrbs = () => {
      const isSmall = width < 768;
      const count = isSmall ? 4 : 6;
      orbs = Array.from({ length: count }, (_, i) => {
        const [hueA, hueB] = PALETTE[i % PALETTE.length];
        const base = Math.min(width, height);
        return {
          r: base * (isSmall ? 0.6 : 0.46) * (0.7 + Math.random() * 0.6),
          hueA,
          hueB,
          ox: Math.random() * width,
          oy: Math.random() * height,
          sx: 0.00006 + Math.random() * 0.00009,
          sy: 0.00006 + Math.random() * 0.00009,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const w = window.innerWidth;
      // Ignore height-only changes (mobile address bar showing/hiding on scroll).
      // Rebuilding here would re-randomize the orbs and make them flicker/teleport.
      if (w === width) return;
      width = w;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildOrbs();
    };

    const drawOrb = (o: Orb, cx: number, cy: number) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
      g.addColorStop(0, o.hueA);
      g.addColorStop(1, o.hueB);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const o of orbs) {
        const cx = o.ox + Math.sin(t * o.sx + o.phase) * (width * 0.34);
        const cy = o.oy + Math.cos(t * o.sy + o.phase) * (height * 0.32);
        drawOrb(o, cx, cy);
      }
    };

    const loop = (t: number) => {
      if (running) render(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      running = !document.hidden;
    };

    resize();
    if (reduce) render(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* Pale-blue base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #ffffff 0%, #eef3ff 45%, #e6edff 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ transform: "translateZ(0)" }}
      />
      {/* Faint dotted grid, fading from the top */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22,35,91,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(22,35,91,0.045) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(100% 55% at 50% 0%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(100% 55% at 50% 0%, #000 30%, transparent 80%)",
        }}
      />
      {/* Soft bottom fade to the paper color to anchor content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(244,247,255,0.9) 0%, transparent 55%)",
        }}
      />
    </div>
  );
}

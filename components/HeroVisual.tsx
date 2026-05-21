"use client";

import { motion } from "framer-motion";

/**
 * "Optical bloom" — an abstract optical motif (NOT an eye): overlapping
 * translucent lens discs, a bright bloom core, a light-refraction streak,
 * slow concentric rings, orbiting particles, and a floating glass voucher card.
 * Pure CSS/SVG + Framer Motion. Light-theme.
 */
export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative mx-auto aspect-square w-[min(86vw,440px)]"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-[6%] rounded-full bg-royal-400/20 blur-3xl" />
      <div className="absolute right-[14%] top-[20%] h-1/3 w-1/3 rounded-full bg-gold-400/20 blur-3xl" />

      {/* Rotating dashed gradient ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow">
        <circle cx="200" cy="200" r="188" fill="none" stroke="url(#ring)" strokeWidth="1.5" strokeDasharray="2 12" />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a4df0" />
            <stop offset="100%" stopColor="#f5a800" />
          </linearGradient>
        </defs>
      </svg>
      {/* Counter-rotating thin ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow [animation-direction:reverse] [animation-duration:40s]">
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(22,35,91,0.12)" strokeWidth="1" />
      </svg>

      {/* Layered translucent lens discs */}
      <div className="absolute inset-[18%]">
        <div
          className="absolute inset-0 rounded-full mix-blend-multiply"
          style={{ background: "radial-gradient(circle at 38% 34%, rgba(120,160,255,0.55) 0%, rgba(42,77,240,0.32) 45%, rgba(42,77,240,0) 72%)", filter: "blur(2px)" }}
        />
        <div
          className="absolute inset-[8%] -translate-x-[6%] translate-y-[4%] rounded-full mix-blend-multiply"
          style={{ background: "radial-gradient(circle at 60% 60%, rgba(255,210,90,0.5) 0%, rgba(245,168,0,0.22) 50%, rgba(245,168,0,0) 75%)", filter: "blur(2px)" }}
        />
        <div
          className="absolute inset-[16%] translate-x-[8%] -translate-y-[6%] rounded-full mix-blend-multiply"
          style={{ background: "radial-gradient(circle at 45% 50%, rgba(150,200,255,0.5) 0%, rgba(120,180,255,0) 70%)", filter: "blur(1px)" }}
        />
        {/* Bright bloom core */}
        <div
          className="absolute inset-[30%] rounded-full"
          style={{ background: "radial-gradient(circle at 42% 38%, #ffffff 0%, rgba(160,190,255,0.85) 40%, rgba(90,120,255,0.25) 70%, transparent 100%)", boxShadow: "0 20px 60px -16px rgba(42,77,240,0.5)" }}
        />
        {/* Specular dot */}
        <div className="absolute left-[34%] top-[30%] h-[10%] w-[10%] rounded-full bg-white blur-[1px]" />
      </div>

      {/* Refraction streak */}
      <div
        className="absolute left-[6%] top-1/2 h-[2px] w-[88%] -translate-y-1/2 -rotate-[28deg]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 45%, rgba(160,190,255,0.7) 55%, transparent)" }}
      />

      {/* Orbiting particles */}
      <div className="absolute inset-0 animate-spin-slow [animation-duration:18s]">
        <span className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold-400 shadow-gold-glow" />
      </div>
      <div className="absolute inset-0 animate-spin-slow [animation-direction:reverse] [animation-duration:26s]">
        <span className="absolute left-1/2 top-3 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-royal-500" />
      </div>

      {/* Floating glass voucher card */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-2 -right-1 sm:bottom-2 sm:-right-4"
      >
        <div className="animate-floaty rounded-2xl border border-line bg-white/90 px-4 py-3 shadow-card backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
            Voucher
          </p>
          <p className="font-display text-2xl font-extrabold leading-none text-navy-800">
            300.000<span className="text-gold-500">đ</span>
          </p>
        </div>
      </motion.div>

      {/* Floating "chính hãng" badge */}
      <motion.div
        initial={{ opacity: 0, y: -16, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-2 top-6 sm:-left-5"
      >
        <div className="animate-floaty rounded-full border border-line bg-white/90 px-3.5 py-2 shadow-soft backdrop-blur [animation-delay:1.5s]">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-navy-700">
            <span className="text-base">🛡️</span> Chính hãng 100%
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

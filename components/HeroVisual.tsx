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

      {/* Floating trust badges around the bloom */}
      {BADGES.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute ${b.pos}`}
        >
          <div
            className="animate-floaty flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 shadow-card"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${b.tint}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                {b.icon}
              </svg>
            </span>
            <span className="whitespace-nowrap text-xs font-bold text-navy-800">{b.label}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

const BADGES = [
  {
    label: "Voucher 300K",
    tint: "bg-gold-500 text-white",
    pos: "-top-1 left-2 -rotate-3 sm:left-6",
    icon: (
      <>
        <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 7v10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Bồi hoàn 1000%",
    tint: "bg-royal-500 text-white",
    pos: "top-12 -right-1 rotate-3 sm:-right-3",
    icon: (
      <>
        <path d="M12 3 5 6v5c0 4.4 3 8.5 7 9.7 4-1.2 7-5.3 7-9.7V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Giao hàng toàn quốc",
    tint: "bg-emerald-500 text-white",
    pos: "bottom-14 -left-1 rotate-2 sm:-left-3",
    icon: (
      <>
        <path d="M2.5 7h10v8h-10zM12.5 10H17l3.5 3.5V15h-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="6" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
  {
    label: "Miễn phí vận chuyển",
    tint: "bg-navy-600 text-white",
    pos: "-bottom-1 right-1 -rotate-2 sm:right-4",
    icon: (
      <>
        <path d="M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </>
    ),
  },
];

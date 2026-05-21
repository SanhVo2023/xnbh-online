"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── Brand icon tiles (hand-built SVG, recognizable, no external assets) ────── */

function ShopeeIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#EE4D2D" />
      <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.6 11.2a3.4 3.4 0 0 1 6.8 0" />
        <path d="M8.7 11.4h10.6l-.7 7.4a1.2 1.2 0 0 1-1.2 1.1H10.6a1.2 1.2 0 0 1-1.2-1.1Z" />
        <path d="M12.4 14.6c.3.9 1 1.4 1.9 1.4s1.5-.4 1.5-1.1c0-1.6-3-1-3-2.6 0-.6.6-1 1.4-1 .7 0 1.3.3 1.6 1" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function TiktokIcon() {
  const note = (
    <path d="M16.2 7.5c.4 1.7 1.7 3 3.4 3.3v2.2c-1.2 0-2.4-.4-3.4-1v4.7a4.7 4.7 0 1 1-4.7-4.7c.3 0 .5 0 .8.1v2.3a2.4 2.4 0 1 0 1.7 2.3V7.5z" />
  );
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#010101" />
      <g transform="translate(-0.9 -0.9)" fill="#25F4EE">{note}</g>
      <g transform="translate(0.9 0.9)" fill="#FE2C55">{note}</g>
      <g fill="#ffffff">{note}</g>
    </svg>
  );
}

function LazadaIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#16179E" />
      <path
        d="M14 20s-5-3.1-5-6.7A2.9 2.9 0 0 1 14 10.4a2.9 2.9 0 0 1 5 2.9C19 16.9 14 20 14 20Z"
        fill="#fff"
      />
      <circle cx="14" cy="13.4" r="1.2" fill="#16179E" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#16235B" />
      <g stroke="#FFC400" strokeWidth="1.3" fill="none">
        <circle cx="14" cy="14" r="5.4" />
        <ellipse cx="14" cy="14" rx="2.4" ry="5.4" />
        <line x1="8.6" y1="14" x2="19.4" y2="14" />
      </g>
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#0068FF" />
      <path
        d="M8.7 8.6h10.6a1.6 1.6 0 0 1 1.6 1.6v4.4a1.6 1.6 0 0 1-1.6 1.6h-4.2L12 20.2v-3.4l-3.3-.6a1.6 1.6 0 0 1-1.6-1.6v-4.4a1.6 1.6 0 0 1 1.6-1.6Z"
        fill="#fff"
      />
      <g fill="#0068FF">
        <circle cx="11" cy="12.6" r="0.95" />
        <circle cx="14" cy="12.6" r="0.95" />
        <circle cx="17" cy="12.6" r="0.95" />
      </g>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#1877F2" />
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M16.2 8.2c-.5-.2-1.1-.3-1.9-.3-1.7 0-2.5 1-2.5 2.7V20.6" />
        <path d="M10 12.5h5.5" />
      </g>
    </svg>
  );
}

export const CHANNELS = [
  { value: "Shopee", label: "Shopee", Icon: ShopeeIcon },
  { value: "Tiktok", label: "TikTok Shop", Icon: TiktokIcon },
  { value: "Lazada", label: "Lazada", Icon: LazadaIcon },
  { value: "Zalo", label: "Zalo", Icon: ZaloIcon },
  { value: "Facebook", label: "Facebook", Icon: FacebookIcon },
  { value: "Website", label: "Website Mắt Việt", Icon: WebsiteIcon },
] as const;

export default function ChannelSelect({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = CHANNELS.find((c) => c.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-3 py-2.5 text-left outline-none transition-all duration-200 focus:ring-2 focus:ring-gold-400/30 ${
          invalid ? "border-red-400" : "border-line focus:border-gold-500/70"
        }`}
      >
        {selected ? (
          <>
            <selected.Icon />
            <span className="flex-1 font-medium text-navy-800">{selected.label}</span>
          </>
        ) : (
          <>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-paper text-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9h12M4 15h16M8 4 6 20M18 4l-2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex-1 text-muted/80">Chọn kênh mua hàng</span>
          </>
        )}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-muted"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-line bg-white p-1.5 shadow-card"
          >
            {CHANNELS.map((c) => {
              const active = c.value === value;
              return (
                <li key={c.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                      active ? "bg-gold-400/15" : "hover:bg-paper"
                    }`}
                  >
                    <c.Icon />
                    <span className="flex-1 font-medium text-navy-800">{c.label}</span>
                    {active && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gold-600">
                        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

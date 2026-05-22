"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Reveal from "./Reveal";
import { VOUCHER_TERMS } from "@/lib/voucher";

const GROUPS = [
  {
    data: VOUCHER_TERMS.apply,
    border: "border-emerald-400",
    chip: "bg-emerald-500/12 text-emerald-600 ring-emerald-500/20",
    count: "bg-emerald-500/12 text-emerald-700",
    openBg: "bg-emerald-500/[0.05]",
    bullet: "text-emerald-500",
    icon: (
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    data: VOUCHER_TERMS.notApply,
    border: "border-rose-400",
    chip: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
    count: "bg-rose-500/10 text-rose-700",
    openBg: "bg-rose-500/[0.05]",
    bullet: "text-rose-500",
    icon: (
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    ),
  },
  {
    data: VOUCHER_TERMS.notes,
    border: "border-royal-500",
    chip: "bg-royal-500/10 text-royal-600 ring-royal-500/20",
    count: "bg-royal-500/10 text-royal-600",
    openBg: "bg-royal-500/[0.05]",
    bullet: "text-royal-500",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function VoucherTerms() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const toggle = (i: number) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  return (
    <section id="voucher-terms" className="section-pad relative">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Voucher 300.000đ</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Điều kiện <span className="text-gradient-gold">sử dụng voucher</span>
            </h2>
            <p className="mt-3 text-muted">
              Chạm vào từng mục để xem chi tiết điều kiện áp dụng.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {GROUPS.map((g, i) => {
            const isOpen = !!open[i];
            return (
              <Reveal key={g.data.title} i={i}>
                <div className={`glass overflow-hidden rounded-2xl border-l-4 ${g.border}`}>
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
                      isOpen ? g.openBg : "hover:bg-navy-700/[0.02]"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${g.chip}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        {g.icon}
                      </svg>
                    </span>
                    <h3 className="flex-1 text-base font-bold text-navy-800">
                      {g.data.title}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${g.count}`}>
                      {g.data.items.length}
                    </span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0 text-navy-700/40"
                    >
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2.5 px-4 pb-4 pt-1">
                          {g.data.items.map((it) => (
                            <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                              <span
                                className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${g.bullet}`}
                                style={{ backgroundColor: "currentColor" }}
                              />
                              {it}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

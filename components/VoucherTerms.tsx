"use client";

import Reveal from "./Reveal";
import { VOUCHER_TERMS } from "@/lib/voucher";

const GROUPS = [
  {
    data: VOUCHER_TERMS.apply,
    accent: "text-emerald-600",
    chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
    icon: (
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    data: VOUCHER_TERMS.notApply,
    accent: "text-rose-600",
    chip: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
    icon: (
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    ),
  },
  {
    data: VOUCHER_TERMS.notes,
    accent: "text-royal-600",
    chip: "bg-royal-500/10 text-royal-600 ring-royal-500/20",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function VoucherTerms() {
  return (
    <section id="voucher-terms" className="section-pad relative">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Voucher 300.000đ</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Điều kiện{" "}
              <span className="text-gradient-gold">sử dụng voucher</span>
            </h2>
            <p className="mt-3 text-muted">
              Vui lòng đọc kỹ điều kiện áp dụng để được hỗ trợ tốt nhất.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GROUPS.map((g, i) => (
            <Reveal key={g.data.title} i={i}>
              <div className="glass h-full rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-navy-800">
                    {g.data.title}
                  </h3>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${g.chip}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {g.icon}
                    </svg>
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {g.data.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${g.accent}`} style={{ backgroundColor: "currentColor" }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

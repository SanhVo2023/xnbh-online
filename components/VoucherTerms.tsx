"use client";

import Reveal from "./Reveal";
import { VOUCHER_TERMS } from "@/lib/voucher";

const CheckIcon = (
  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
);
const CrossIcon = (
  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
);

function Block({
  label,
  items,
  tone,
}: {
  label: string;
  items: readonly string[];
  tone: "apply" | "deny";
}) {
  const ok = tone === "apply";
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${
            ok
              ? "bg-emerald-500/12 text-emerald-600 ring-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 ring-rose-500/20"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            {ok ? CheckIcon : CrossIcon}
          </svg>
        </span>
        <h3
          className={`text-sm font-bold uppercase tracking-[0.08em] ${
            ok ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {label}
        </h3>
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-navy-700/90">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className={`mt-0.5 shrink-0 ${ok ? "text-emerald-500" : "text-rose-500"}`}
            >
              {ok ? CheckIcon : CrossIcon}
            </svg>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function VoucherTerms() {
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
              Vui lòng đọc kỹ điều kiện áp dụng để được hỗ trợ tốt nhất.
            </p>
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="glass rounded-3xl p-5 sm:p-7">
              <Block label="Được áp dụng" items={VOUCHER_TERMS.apply.items} tone="apply" />

              <div className="my-5 border-t border-line" />

              <Block label="Không áp dụng" items={VOUCHER_TERMS.notApply.items} tone="deny" />

              <div className="my-5 border-t border-line" />

              {/* Lưu ý note strip */}
              <div className="flex gap-3 rounded-2xl bg-royal-500/[0.06] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-royal-500/10 text-royal-600 ring-1 ring-royal-500/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-800">Lưu ý</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {VOUCHER_TERMS.notes.items.map((it) => (
                      <li key={it} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-royal-500" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

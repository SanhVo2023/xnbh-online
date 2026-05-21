"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SubmitSuccess } from "@/lib/validation";
import { MIN_ORDER_LABEL, VOUCHER_TERMS } from "@/lib/voucher";

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL || "https://matviet.vn";

function Confetti() {
  const pieces = Array.from({ length: 22 });
  const colors = ["#FFC400", "#5A78FF", "#F5A800", "#2A4DF0", "#16235B"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.6 + Math.random() * 1.2;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: 520, opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

export default function SuccessModal({
  data,
  onClose,
}: {
  data: SubmitSuccess | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [data, onClose]);

  const copy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-navy-900/55 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.88, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-[28px] p-6 shadow-card sm:p-8"
          >
            <Confetti />

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-700/5 text-navy-700/50 transition-colors hover:bg-navy-700/10 hover:text-navy-700"
            >
              ✕
            </button>

            <div className="relative text-center">
              {/* animated check seal */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold-glow"
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold-400/60" />
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="relative">
                  <motion.path
                    d="m5 13 4 4L19 7"
                    stroke="#0B1438"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  />
                </svg>
              </motion.div>

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-600">
                {data.deduped ? "Bạn đã xác nhận trước đó" : "Xác nhận thành công"}
              </p>
              <h2
                id="success-title"
                className="mt-2 text-2xl font-extrabold leading-tight text-navy-800 sm:text-[26px]"
              >
                {data.deduped
                  ? "Đây là voucher của bạn"
                  : "Xác nhận bảo hành chính hãng thành công"}
              </h2>
              <p className="mt-2 text-pretty text-sm text-muted">
                {data.deduped
                  ? "Số điện thoại này đã kích hoạt bảo hành. Bạn có thể dùng lại mã ưu đãi bên dưới."
                  : "Chúc mừng bạn đã nhận được voucher 300.000đ 🎉"}
              </p>

              {/* Voucher code ticket */}
              <div className="relative mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-gold-500/50 bg-gold-400/[0.1] p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    Mã ưu đãi của bạn
                  </p>
                  <div className="mt-2 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
                    <span className="select-all whitespace-nowrap font-display text-[28px] font-extrabold tracking-[0.08em] text-gold-600 sm:text-3xl">
                      {data.voucherCode}
                    </span>
                    <button
                      onClick={copy}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-navy-700/8 px-3 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-700/15"
                    >
                      {copied ? "✓ Đã chép" : "Sao chép"}
                    </button>
                  </div>
                  {/* ticket notches blend into the white card */}
                  <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                  <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
                <div className="rounded-xl bg-paper px-3 py-2.5">
                  <p className="text-muted">Áp dụng</p>
                  <p className="font-semibold text-navy-800">Đơn từ {MIN_ORDER_LABEL}</p>
                </div>
                <div className="rounded-xl bg-paper px-3 py-2.5">
                  <p className="text-muted">Hạn sử dụng</p>
                  <p className="font-semibold text-navy-800">{data.expiryDays} ngày</p>
                </div>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-gold-500">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Mã cũng được gửi qua SMS trong vòng 24 giờ.
              </p>

              {/* Collapsible voucher T&C */}
              <div className="mt-4 overflow-hidden rounded-xl border border-line text-left">
                <button
                  onClick={() => setShowTerms((s) => !s)}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-navy-700 transition-colors hover:bg-paper"
                  aria-expanded={showTerms}
                >
                  Xem điều kiện sử dụng voucher
                  <motion.span animate={{ rotate: showTerms ? 45 : 0 }} className="text-base leading-none text-muted">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {showTerms && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 px-4 pb-4 text-[11px] leading-relaxed">
                        {[VOUCHER_TERMS.apply, VOUCHER_TERMS.notApply, VOUCHER_TERMS.notes].map((g) => (
                          <div key={g.title}>
                            <p className="font-bold text-navy-700">{g.title}</p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted">
                              {g.items.map((it) => (
                                <li key={it}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-5 w-full text-base"
              >
                DÙNG MÃ NGAY
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                onClick={onClose}
                className="mt-3 text-sm font-medium text-muted transition-colors hover:text-navy-700"
              >
                Để sau
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

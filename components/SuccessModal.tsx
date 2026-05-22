"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SubmitSuccess } from "@/lib/validation";
import { MIN_ORDER_LABEL, VOUCHER_TERMS } from "@/lib/voucher";

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL || "https://matviet.vn";

function Confetti() {
  const pieces = Array.from({ length: 26 });
  const colors = ["#FFC400", "#5A78FF", "#F5A800", "#2A4DF0", "#16235B"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = 0.15 + Math.random() * 0.4;
        const duration = 1.7 + Math.random() * 1.3;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        const round = i % 3 === 0;
        return (
          <motion.span
            key={i}
            initial={{ y: -24, opacity: 0, rotate: 0 }}
            animate={{ y: 560, opacity: [0, 1, 1, 0], rotate: 540 }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              width: size,
              height: round ? size : size * 0.6,
              background: color,
              borderRadius: round ? "50%" : 2,
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
  const reduce = useReducedMotion();

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

  // ── Choreography ────────────────────────────────────────────────────────────
  const container: Variants = reduce
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      };

  const sealV: Variants = reduce
    ? item
    : {
        hidden: { scale: 0, rotate: -45, opacity: 0 },
        show: { scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", damping: 11, stiffness: 210 } },
      };

  const ticketV: Variants = reduce
    ? item
    : {
        hidden: { opacity: 0, y: 18, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 18, stiffness: 240 } },
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
          <div className="absolute inset-0 bg-navy-900/55 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-[28px] p-6 shadow-card sm:p-8"
          >
            {!reduce && <Confetti />}

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Đóng"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-700/5 text-navy-700/50 transition-colors hover:bg-navy-700/10 hover:text-navy-700"
            >
              ✕
            </button>

            <motion.div
              className="relative text-center"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {/* animated check seal with ray burst + glow */}
              <motion.div variants={sealV} className="relative mx-auto mb-5 h-20 w-20">
                {!reduce && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-gold-400/45 blur-xl"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.35, 1.1], opacity: [0, 0.85, 0.5] }}
                    transition={{ duration: 1, delay: 0.15 }}
                  />
                )}

                {/* radiating rays */}
                {!reduce &&
                  Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2"
                      style={{ transform: `rotate(${i * 36}deg) translateY(-50px)` }}
                    >
                      <motion.span
                        className="block h-2.5 w-[3px] -translate-x-1/2 rounded-full bg-gold-400"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.55, delay: 0.28 + i * 0.012, ease: "easeOut" }}
                      />
                    </span>
                  ))}

                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold-glow">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold-400/60" />
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="relative">
                    <motion.path
                      d="m5 13 4 4L19 7"
                      stroke="#0B1438"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: reduce ? 0 : 0.38 }}
                    />
                  </svg>
                </span>
              </motion.div>

              <motion.p
                variants={item}
                className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-600"
              >
                {data.deduped ? "Bạn đã xác nhận trước đó" : "Xác nhận thành công"}
              </motion.p>
              <motion.h2
                variants={item}
                id="success-title"
                className="mt-2 text-2xl font-extrabold leading-tight text-navy-800 sm:text-[26px]"
              >
                {data.deduped
                  ? "Đây là voucher của bạn"
                  : "Xác nhận bảo hành chính hãng thành công"}
              </motion.h2>
              <motion.p variants={item} className="mt-2 text-pretty text-sm text-muted">
                {data.deduped
                  ? "Số điện thoại này đã kích hoạt bảo hành. Bạn có thể dùng lại mã ưu đãi bên dưới."
                  : "Chúc mừng bạn đã nhận được voucher 300.000đ 🎉"}
              </motion.p>

              {/* Voucher code ticket */}
              <motion.div variants={ticketV} className="relative mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-gold-500/50 bg-gold-400/[0.1] p-5">
                  {/* one-pass shine sweep */}
                  {!reduce && (
                    <motion.span
                      className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                      initial={{ x: "-160%" }}
                      animate={{ x: "360%" }}
                      transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    Mã ưu đãi của bạn
                  </p>
                  <div className="mt-2 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
                    <motion.span
                      initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                      animate={reduce ? false : { scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 260, delay: 0.5 }}
                      className="select-all whitespace-nowrap font-display text-[28px] font-extrabold tracking-[0.08em] text-gold-600 sm:text-3xl"
                    >
                      {data.voucherCode}
                    </motion.span>
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
              </motion.div>

              <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
                <div className="rounded-xl bg-paper px-3 py-2.5">
                  <p className="text-muted">Áp dụng</p>
                  <p className="font-semibold text-navy-800">Đơn từ {MIN_ORDER_LABEL}</p>
                </div>
                <div className="rounded-xl bg-paper px-3 py-2.5">
                  <p className="text-muted">Hạn sử dụng</p>
                  <p className="font-semibold text-navy-800">{data.expiryDays} ngày</p>
                </div>
              </motion.div>

              <motion.p
                variants={item}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-muted"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-gold-500">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Mã cũng được gửi qua SMS trong vòng 24 giờ.
              </motion.p>

              {/* Collapsible voucher T&C */}
              <motion.div
                variants={item}
                className="mt-4 overflow-hidden rounded-xl border border-line text-left"
              >
                <button
                  onClick={() => setShowTerms((s) => !s)}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-navy-700 transition-colors hover:bg-paper"
                  aria-expanded={showTerms}
                >
                  Xem điều kiện sử dụng voucher
                  <motion.svg
                    animate={{ rotate: showTerms ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0 text-muted"
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
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
              </motion.div>

              <motion.a
                variants={item}
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-5 w-full text-base"
              >
                DÙNG MÃ NGAY
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
              <motion.button
                variants={item}
                onClick={onClose}
                className="mt-3 w-full text-sm font-medium text-muted transition-colors hover:text-navy-700"
              >
                Để sau
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

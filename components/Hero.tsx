"use client";

import { motion } from "framer-motion";
import HeroVisual from "./HeroVisual";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] flex-col items-center justify-center px-5 pb-10 pt-24 sm:px-8"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-wide grid items-center gap-6 md:grid-cols-2"
      >
        {/* Copy */}
        <div className="text-center md:text-left">
          <motion.div variants={item} className="flex justify-center md:justify-start">
            <span className="eyebrow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
              </span>
              Hành trình 35+ năm · Since 1989
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Xác nhận
            <br className="hidden sm:block" /> bảo hành{" "}
            <span className="text-gradient-gold">chính hãng</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted md:mx-0 sm:text-lg"
          >
            Kích hoạt bảo hành cho sản phẩm Mắt Việt của bạn và{" "}
            <span className="font-semibold text-navy-800">
              nhận ngay voucher 300.000đ
            </span>{" "}
            cho lần mua tiếp theo. Chỉ mất 30 giây.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
          >
            <a href="#form" className="btn-gold w-full sm:w-auto">
              Xác nhận & nhận voucher
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#how" className="btn-ghost w-full sm:w-auto">
              Cách thức hoạt động
            </a>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-5 flex items-center justify-center gap-2 text-sm text-muted md:justify-start"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold-400">
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
            Đã có hơn 50.000 khách hàng kích hoạt bảo hành
          </motion.p>
        </div>

        {/* Visual */}
        <motion.div variants={item} className="relative">
          <HeroVisual />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-navy-700/25 p-1">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-navy-700/50"
          />
        </div>
      </motion.div>
    </section>
  );
}

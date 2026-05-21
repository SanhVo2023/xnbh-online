"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        {/* Navy+gold logo reads directly on the light canvas — no plate needed */}
        <a href="#top" className="flex items-center" aria-label="Mắt Việt">
          <Image
            src="/asset/logo.png"
            alt="Mắt Việt"
            width={132}
            height={59}
            priority
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-9" : "h-10 sm:h-11"
            }`}
          />
        </a>

        <a
          href="#form"
          className="hidden rounded-full border border-gold-500/30 bg-gold-400/15 px-4 py-2 text-sm font-semibold text-gold-600 transition-colors hover:bg-gold-400/25 sm:inline-flex"
        >
          Nhận voucher 300K
        </a>
      </div>

      {/* glass underlay appears on scroll */}
      <div
        className={`absolute inset-0 -z-10 border-b border-line transition-opacity duration-300 ${
          scrolled ? "glass opacity-100" : "opacity-0"
        }`}
      />
    </motion.header>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Reveal from "./Reveal";

const TERMS = [
  {
    tag: "07 ngày",
    title: "Đổi mới 1 đổi 1",
    body: "Trong vòng 07 ngày kể từ ngày mua, Quý khách được đổi sản phẩm mới hoàn toàn miễn phí nếu chưa hài lòng về sản phẩm.",
  },
  {
    tag: "30 ngày",
    title: "Đổi 1-1 nếu lỗi sản phẩm",
    body: "Trong vòng 30 ngày, Mắt Việt đổi sản phẩm mới nếu phát sinh lỗi từ nhà sản xuất như: gãy mối hàn, gãy lò xo… không do tác động bên ngoài.",
  },
  {
    tag: "90 ngày",
    title: "Bảo hành thích nghi độ kính",
    body: "Sau khi đo mắt tại Mắt Việt, Quý khách được bảo hành thích nghi độ kính lên đến 90 ngày để đảm bảo trải nghiệm thị lực tốt nhất.",
  },
  {
    tag: "18 tháng",
    title: "Bảo hành chính hãng",
    body: "Miễn phí khắc phục các lỗi kỹ thuật từ nhà sản xuất: gãy lò xo, ve mũi, lỏng ốc vít, gãy mối hàn… trong suốt 18 tháng.",
  },
  {
    tag: "1000%",
    title: "Cam kết hàng chính hãng",
    body: "Mắt Việt cam kết đền bù 1000% giá trị sản phẩm nếu phát hiện hàng không chính hãng. An tâm tuyệt đối khi mua sắm.",
  },
];

export default function WarrantyTerms() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="terms" className="section-pad relative">
      <div className="container-wide grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-start">
        <Reveal>
          <div className="md:sticky md:top-28">
            <span className="eyebrow">Quyền lợi của bạn</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Điều kiện{" "}
              <span className="text-gradient-gold">bảo hành</span>
            </h2>
            <p className="mt-3 max-w-sm text-muted">
              Chính sách bảo hành minh bạch, áp dụng toàn hệ thống Mắt Việt trên
              cả nước.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl glass px-4 py-3">
              <span className="text-2xl">📍</span>
              <p className="text-sm text-muted">
                Áp dụng tại{" "}
                <span className="font-semibold text-navy-800">tất cả cửa hàng</span>{" "}
                Mắt Việt
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal i={1}>
          <ul className="flex flex-col gap-3">
            {TERMS.map((t, idx) => {
              const isOpen = open === idx;
              return (
                <li key={t.title} className="glass overflow-hidden rounded-2xl">
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-royal-500/[0.04]"
                    aria-expanded={isOpen}
                  >
                    <span className="flex min-w-[68px] justify-center rounded-full bg-gold-400/20 px-3 py-1 text-sm font-bold text-gold-600 ring-1 ring-gold-500/20">
                      {t.tag}
                    </span>
                    <span className="flex-1 font-semibold text-navy-800">
                      {t.title}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-xl leading-none text-navy-700/50"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pl-[92px] text-sm leading-relaxed text-muted">
                          {t.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

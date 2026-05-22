"use client";

import Reveal from "./Reveal";

const BADGES = [
  {
    value: "07",
    unit: "ngày",
    title: "Đổi mới 1-1",
    desc: "Đổi sản phẩm mới dễ dàng nếu chưa hài lòng.",
    icon: (
      <path
        d="M3 12a9 9 0 0 1 15-6.7L21 8M21 12a9 9 0 0 1-15 6.7L3 16m18-8V4m0 4h-4M3 16v4m0-4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    value: "1000",
    unit: "%",
    title: "Cam kết bồi hoàn",
    desc: "Đền bù 1000% nếu phát hiện hàng không chính hãng.",
    icon: (
      <>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    value: "18",
    unit: "tháng",
    title: "Bảo hành chính hãng",
    desc: "Miễn phí khắc phục lỗi kỹ thuật từ nhà sản xuất.",
    icon: (
      <>
        <path d="M12 3 5 6v5c0 4.4 3 8.5 7 9.7 4-1.2 7-5.3 7-9.7V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section className="relative px-5 py-8 sm:px-8">
      <div className="container-wide grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {BADGES.map((b, i) => (
          <Reveal key={b.title} i={i}>
            <div className="group glass relative h-full overflow-hidden rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-600 ring-1 ring-gold-500/20">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    {b.icon}
                  </svg>
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold leading-none text-gradient-cool">
                    {b.value}
                  </span>
                  <span className="text-base font-bold text-gold-600">{b.unit}</span>
                </div>
              </div>
              <h3 className="mt-3 text-base font-bold text-navy-800">{b.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.desc}</p>
              {/* hover sheen */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-royal-400/25 blur-2xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-0" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

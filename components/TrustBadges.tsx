"use client";

import Reveal from "./Reveal";

const BADGES = [
  {
    value: "07",
    unit: "ngày",
    title: "Đổi/ trả hàng miễn phí",
    desc: "Đổi hoặc trả sản phẩm dễ dàng nếu chưa hài lòng.",
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
    <section className="relative px-5 py-10 sm:px-8">
      <div className="container-wide grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-6">
        {BADGES.map((b, i) => (
          <Reveal key={b.title} i={i}>
            {/* Boxless, sleek; thin divider between items on mobile only */}
            <div
              className={`text-center ${
                i > 0 ? "border-t border-line pt-7 sm:border-0 sm:pt-0" : ""
              }`}
            >
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="font-display text-[2.75rem] font-extrabold leading-none text-gradient-cool">
                  {b.value}
                </span>
                <span className="text-lg font-bold text-gold-500">{b.unit}</span>
              </div>
              <h3 className="mt-2.5 text-base font-bold leading-snug text-navy-800">
                {b.title}
                <span className="ml-1.5 inline-block align-middle text-gold-500">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    {b.icon}
                  </svg>
                </span>
              </h3>
              <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-relaxed text-muted">
                {b.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

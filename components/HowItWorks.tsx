"use client";

import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Quét mã QR",
    desc: "Quét mã QR trên thẻ bảo hành đi kèm sản phẩm Mắt Việt của bạn.",
    icon: (
      <>
        <path d="M4 7V5a1 1 0 0 1 1-1h2M4 17v2a1 1 0 0 0 1 1h2m10-16h2a1 1 0 0 1 1 1v2m-3 13h2a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="8" y="8" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
  {
    n: "02",
    title: "Điền thông tin",
    desc: "Nhập họ tên, số điện thoại và email. Nhanh gọn trong 30 giây.",
    icon: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="9" y="2.5" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    n: "03",
    title: "Nhận voucher 300K",
    desc: "Mã ưu đãi hiện ngay trên màn hình và gửi qua SMS để bạn dùng cho lần mua sau.",
    icon: (
      <>
        <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 7v10" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 3" strokeLinecap="round" />
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section-pad relative">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Quy trình</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Chỉ <span className="text-gradient-gold">3 bước</span> đơn giản
            </h2>
            <p className="mt-3 text-muted">
              Từ lúc quét mã đến khi cầm voucher trên tay — chưa đầy một phút.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          {/* connector line on desktop */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-navy-700/15 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} i={i}>
              <div className="glass relative h-full rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-500 to-navy-700 text-white shadow-glow ring-1 ring-white/30">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      {s.icon}
                    </svg>
                  </span>
                  <span className="font-display text-5xl font-extrabold text-navy-800/[0.07]">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

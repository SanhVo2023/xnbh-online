import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-5 py-12 sm:px-8">
      <div className="container-wide flex flex-col items-center gap-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Image
            src="/asset/logo.png"
            alt="Mắt Việt"
            width={140}
            height={63}
            className="h-11 w-auto"
          />
          <span className="hidden h-8 w-px bg-line sm:block" />
          <Image
            src="/asset/visioncare-logo.png"
            alt="VisionCare — Săn sóc đôi mắt Việt"
            width={150}
            height={50}
            className="h-8 w-auto"
          />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted">
          Hệ thống mắt kính chính hãng hàng đầu Việt Nam.{" "}
          <span className="whitespace-nowrap font-semibold text-gold-600">
            Since 1989.
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <a href="https://matviet.vn" className="transition-colors hover:text-royal-600">
            matviet.vn
          </a>
          <a href="tel:19006081" className="transition-colors hover:text-royal-600">
            Hotline: 1900 6081
          </a>
          <a
            href="https://matviet.vn/pages/he-thong-cua-hang"
            className="transition-colors hover:text-royal-600"
          >
            Hệ thống cửa hàng
          </a>
        </div>

        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} Công ty Mắt Việt. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}

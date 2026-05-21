import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://baohanh.matviet.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Xác nhận bảo hành chính hãng | Mắt Việt",
  description:
    "Kích hoạt bảo hành chính hãng cho sản phẩm Mắt Việt và nhận ngay voucher 300.000đ cho lần mua tiếp theo. Nhanh chóng, chính hãng, an tâm.",
  keywords: [
    "Mắt Việt",
    "bảo hành",
    "xác nhận bảo hành",
    "mắt kính chính hãng",
    "voucher",
    "kính mắt",
  ],
  authors: [{ name: "Mắt Việt" }],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Xác nhận bảo hành chính hãng | Mắt Việt",
    description:
      "Kích hoạt bảo hành chính hãng và nhận ngay voucher 300.000đ. Hệ thống mắt kính chính hãng hàng đầu Việt Nam.",
    type: "website",
    locale: "vi_VN",
    siteName: "Mắt Việt",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mắt Việt — Xác nhận bảo hành" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xác nhận bảo hành chính hãng | Mắt Việt",
    description: "Kích hoạt bảo hành chính hãng và nhận ngay voucher 300.000đ.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F4F7FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

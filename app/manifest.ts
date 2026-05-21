import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mắt Việt — Xác nhận bảo hành",
    short_name: "Mắt Việt BH",
    description:
      "Xác nhận bảo hành chính hãng Mắt Việt và nhận voucher 300.000đ.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F7FF",
    theme_color: "#F4F7FF",
    lang: "vi",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

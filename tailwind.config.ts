import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
        display: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#070C24",
          900: "#070C24",
          800: "#0B1438",
        },
        navy: {
          DEFAULT: "#16235B",
          950: "#070C24",
          900: "#0B1438",
          800: "#111C4D",
          700: "#16235B",
          600: "#1E2F73",
          500: "#2A3F94",
          400: "#3C56C0",
        },
        royal: {
          400: "#5A78FF",
          500: "#2A4DF0",
          600: "#1733B8",
        },
        gold: {
          300: "#FFE08A",
          400: "#FFC400",
          500: "#F5A800",
          600: "#D98E00",
        },
        paper: "#F4F7FF",
        line: "#E2E8F5",
        muted: "#5B6B8C",
      },
      boxShadow: {
        glow: "0 30px 80px -34px rgba(42, 77, 240, 0.4)",
        "gold-glow": "0 14px 40px -12px rgba(245, 168, 0, 0.45)",
        card: "0 30px 70px -30px rgba(22, 35, 91, 0.4)",
        soft: "0 12px 34px -18px rgba(22, 35, 91, 0.3)",
        "inner-line": "inset 0 0 0 1px rgba(22,35,91,0.06)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-14px) translateX(6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-ring": "pulse-ring 2.8s cubic-bezier(0.4,0,0.2,1) infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

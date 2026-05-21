# Mắt Việt — Online Xác Nhận Bảo Hành

Mobile-first landing page where customers scan the QR on their warranty card,
confirm their authentic-product warranty, and instantly receive a **300.000đ
voucher** (shown on screen + sent by SMS 24h later via eSMS).

**Stack:** Next.js (App Router) · Tailwind CSS · Framer Motion · Canvas animation
· Google Apps Script + Google Sheets backend · eSMS SMS · deploy on Netlify.

---

## Quick start (local dev)

```bash
npm install
cp .env.local.example .env.local   # leave GAS_WEBAPP_URL empty → MOCK MODE
npm run dev                         # http://localhost:3000
```

In **mock mode** (no `GAS_WEBAPP_URL`) the form returns a fake voucher and
simulates dedup, so you can develop the whole UI without the backend.

## Project layout

```
app/
  layout.tsx          fonts (Be Vietnam Pro), metadata, OG, favicon, manifest
  page.tsx            landing-page composition
  globals.css         brand tokens, glass/CTA utilities, grain, reduced-motion
  manifest.ts         PWA manifest (add-to-home-screen)
  api/submit/route.ts server proxy → GAS (validation, honeypot, rate limit, mock)
components/           AbstractBackground, Hero/HeroVisual, TrustBadges,
                      HowItWorks, WarrantyForm, SuccessModal, WarrantyTerms, …
lib/                  phone.ts (VN normalization), validation.ts (zod)
gas/                  Code.gs (backend) + README.md (deploy guide) + sample CSV
scripts/gen-icons.mjs regenerate the favicon/icon set from asset/favicon.png
public/               logo, visioncare-logo, generated icons + og.png
```

## How it works

1. User scans the (single, static) QR → opens this site.
2. Fills **Họ tên · SĐT · Email · đồng ý điều khoản** → posts to `/api/submit`.
3. `/api/submit` validates + proxies to the GAS web app (avoids CORS, hides the
   GAS URL, rate-limits).
4. GAS applies a **2-day dedup cooldown** by normalized phone (re-submit within
   48h → the **same** code; after 48h → a **new** voucher), allocates a
   pre-generated voucher, logs the row.
5. Success popup (light theme) shows the code immediately + min-order **1.500.000đ**
   + collapsible voucher T&C (**DÙNG MÃ NGAY**).
6. An hourly GAS trigger sends the voucher SMS via eSMS **24h** after submission,
   with **HSD = send date + 30 days**.

## Backend

See **`gas/README.md`** for the full Google Apps Script + Sheet setup, eSMS
configuration, voucher seeding, and Web App deployment.

## Deploy (Netlify)

1. Push the repo and connect it to Netlify (the `@netlify/plugin-nextjs` plugin
   in `netlify.toml` handles the Next.js runtime).
2. Set environment variables (Site settings → Environment variables):

   | Var | Value |
   |-----|-------|
   | `GAS_WEBAPP_URL` | the GAS `/exec` URL |
   | `GAS_SHARED_SECRET` | same as the `SHARED_SECRET` constant in `gas/Code.gs` |
   | `NEXT_PUBLIC_SHOP_URL` | `https://matviet.vn` (the "DÙNG MÃ NGAY" target) |
   | `NEXT_PUBLIC_SITE_URL` | the production URL (for OG/canonical) |

3. Deploy. Generate a QR code pointing at the production URL for the warranty cards.

## Notes / still needed from Mắt Việt

- **eSMS `ApiKey` / `SecretKey`** → paste into the constants at the top of
  `gas/Code.gs` (internal tool — keys live in code; `Brandname` = `MATVIET` and the
  approved SMS template are already wired in).
- The **pre-generated voucher code list** → paste into the `Vouchers` sheet.
- Confirm the **DÙNG MÃ NGAY** destination (defaults to `https://matviet.vn`).

`asset/GAS-example.txt` was empty, so the backend was written from scratch in
`gas/Code.gs`.

## Accessibility & performance

- `prefers-reduced-motion` disables the animated background + transitions.
- Canvas orb field caps DPR, reduces orb count on phones, pauses when the tab is
  hidden. First Load JS ≈ 172 kB.
- Vietnamese diacritics fully supported via Be Vietnam Pro.

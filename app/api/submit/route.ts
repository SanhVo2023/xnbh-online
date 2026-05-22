import { NextRequest, NextResponse } from "next/server";
import { submissionSchema, type SubmitResponse } from "@/lib/validation";
import { normalizeVNPhone } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GAS_URL = process.env.GAS_WEBAPP_URL;
const SHARED_SECRET = process.env.GAS_SHARED_SECRET || "";
const VOUCHER_VALUE = 300000;
const EXPIRY_DAYS = 30;

// ── Soft per-IP rate limit (in-memory; best-effort on serverless) ──────────────
const WINDOW_MS = 60_000;
const MAX_HITS = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

// ── Mock store for local dev when GAS_WEBAPP_URL is unset ─────────────────────
// Mirrors the GAS 2-day cooldown: same code within 48h, new voucher after.
const DEDUP_WINDOW_MS = 48 * 60 * 60 * 1000;
const mockClaims = new Map<string, { code: string; ts: number }>();
function mockVoucher(): string {
  const s = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `MV300-${s.slice(0, 6)}`;
}

function json(body: SubmitResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ ok: false, error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau giây lát." }, 429);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, error: "Dữ liệu không hợp lệ." }, 400);
  }

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: "Vui lòng kiểm tra lại thông tin." }, 400);
  }

  // Honeypot tripped → pretend success, allocate nothing.
  if (parsed.data.website) {
    return json({
      ok: true,
      deduped: false,
      voucherCode: "MV300-XXXXXX",
      voucherValue: VOUCHER_VALUE,
      expiryDays: EXPIRY_DAYS,
    });
  }

  const phoneNorm = normalizeVNPhone(parsed.data.phone);
  if (!phoneNorm) {
    return json({ ok: false, error: "Số điện thoại không hợp lệ." }, 400);
  }

  const payload = {
    secret: SHARED_SECRET,
    hoTen: parsed.data.hoTen,
    phoneRaw: parsed.data.phone,
    phoneNorm,
    email: parsed.data.email || "",
    channel: parsed.data.channel,
    source: req.headers.get("referer") || "",
    userAgent: req.headers.get("user-agent") || "",
    ip,
  };

  // ── MOCK MODE ───────────────────────────────────────────────────────────────
  if (!GAS_URL) {
    const prev = mockClaims.get(phoneNorm);
    const withinCooldown = prev && Date.now() - prev.ts < DEDUP_WINDOW_MS;
    const code = withinCooldown ? prev!.code : mockVoucher();
    if (!withinCooldown) mockClaims.set(phoneNorm, { code, ts: Date.now() });
    const exp = new Date(Date.now() + EXPIRY_DAYS * 86400000);
    const expiryDate = `${String(exp.getDate()).padStart(2, "0")}/${String(exp.getMonth() + 1).padStart(2, "0")}/${exp.getFullYear()}`;
    await new Promise((r) => setTimeout(r, 600)); // simulate latency
    return json({
      ok: true,
      deduped: Boolean(withinCooldown),
      voucherCode: code,
      voucherValue: VOUCHER_VALUE,
      expiryDays: EXPIRY_DAYS,
      expiryDate,
    });
  }

  // ── PROXY TO GAS ──────────────────────────────────────────────────────────────
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 12_000);
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: ctrl.signal,
    });
    clearTimeout(timeout);

    const data = (await res.json()) as Partial<SubmitResponse> & {
      error?: string;
    };

    if (!data || data.ok !== true) {
      return json(
        { ok: false, error: data?.error || "Hệ thống đang bận, vui lòng thử lại." },
        502
      );
    }

    return json({
      ok: true,
      deduped: Boolean((data as any).deduped),
      voucherCode: String((data as any).voucherCode),
      voucherValue: Number((data as any).voucherValue) || VOUCHER_VALUE,
      expiryDays: Number((data as any).expiryDays) || EXPIRY_DAYS,
      expiryDate: (data as any).expiryDate,
    });
  } catch {
    return json(
      { ok: false, error: "Không thể kết nối hệ thống bảo hành. Vui lòng thử lại sau." },
      502
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "matviet-xnbh", mock: !GAS_URL });
}

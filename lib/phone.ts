/**
 * Vietnamese phone normalization — the canonical dedup key.
 *
 * IMPORTANT: keep these rules in sync with `normalizeVNPhone()` in gas/Code.gs.
 * The GAS backend is the source of truth; this client/server copy gives instant
 * feedback and lets /api/submit reject obviously-bad input before hitting GAS.
 *
 * Accepts inputs like: "0901 234 567", "+84 90 123 4567", "84901234567",
 * "0084901234567" and returns the canonical 10-digit form "0901234567".
 */

// VN mobile prefixes after the leading 0 (post 2018 conversion):
//  03x (Viettel), 05x (Vietnamobile/Reddi), 07x (Mobifone),
//  08x (Vinaphone), 09x (all carriers)
const VN_MOBILE_RE = /^0(3[2-9]|5[25689]|7[06-9]|8[1-9]|9\d)\d{7}$/;

export function normalizeVNPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;

  // Keep only digits (drops spaces, dashes, dots, parentheses, leading +).
  let digits = String(raw).replace(/\D/g, "");

  // Strip international prefixes: 0084... or 84...
  if (digits.startsWith("0084")) digits = digits.slice(4);
  else if (digits.startsWith("84") && digits.length >= 11) digits = digits.slice(2);

  // Ensure a single leading zero for the national format.
  if (!digits.startsWith("0")) digits = "0" + digits;

  return VN_MOBILE_RE.test(digits) ? digits : null;
}

export function isValidVNPhone(raw: string | null | undefined): boolean {
  return normalizeVNPhone(raw) !== null;
}

/** Pretty display form: 0901 234 567 */
export function formatVNPhone(raw: string): string {
  const n = normalizeVNPhone(raw);
  if (!n) return raw;
  return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
}

# Mắt Việt — GAS Backend (Xác Nhận Bảo Hành)

Google Apps Script web app + Google Sheet that powers warranty confirmation:
allocates pre-generated **300.000đ** vouchers, applies a **2-day dedup cooldown**,
and sends the voucher SMS via **eSMS** 24h after submission.

> This is an **internal tool**, so the eSMS keys live directly in `Code.gs`
> constants (not Script Properties). Don't publish this file publicly with real keys.

---

## 1. Create the project
1. Create a new **Google Sheet** (the database).
2. **Extensions → Apps Script**, delete the stub, paste **`Code.gs`**, save.

## 2. Fill in the constants (top of `Code.gs`)
```js
var ESMS_API_KEY    = "...";       // real eSMS ApiKey
var ESMS_SECRET_KEY = "...";       // real eSMS SecretKey
var BRANDNAME       = "MATVIET";   // registered Brandname
var SHARED_SECRET   = "....";      // long random; also set in Netlify GAS_SHARED_SECRET
```
Other tunables already set: `VOUCHER_VALUE=300000`, `MIN_ORDER=1500000`,
`EXPIRY_DAYS=30`, `SMS_DELAY_HOURS=24`, `DEDUP_WINDOW_HOURS=48`, and the
`SMS_TEMPLATE` (with `{{code}}` / `{{exp}}` placeholders).

## 3. Build the sheets + trigger
Run **`setup()`** once (authorize). Creates:

| Sheet | Purpose |
|-------|---------|
| `Submissions` | one row per confirmation (voucher, `smsStatus`, `expiryAt`, …) |
| `Vouchers` | the pre-generated code pool (`available` → `allocated`) |
| `Config` | read-only reference of the current settings |
| `Logs` | errors + raw eSMS responses |

…and installs the **hourly** `sendPendingVouchers` trigger.

## 4. Load voucher codes
Paste codes into the **`Vouchers` sheet, column A from row 2 down** (leave the
other columns blank), or paste into `SEED_CODES` and run `seedVouchersFromText()`.

## 5. Deploy as Web App
**Deploy → New deployment → Web app** — *Execute as:* **Me**, *Access:* **Anyone**.
Copy the **`/exec` URL** → Netlify env `GAS_WEBAPP_URL`. Re-deploy a **new version**
after any code edit.

---

## Behavior

### Dedup — 2-day cooldown
`doPost` finds the phone's most-recent submission. If it was **< 48h ago**, it
returns that **same** voucher (`deduped:true`) — no new allocation. If **≥ 48h**
(or first time), it allocates a **new** voucher and appends a new row. A phone can
therefore receive multiple vouchers over time, ≥ 2 days apart. Allocation is wrapped
in a `LockService` lock so concurrent submits can't double-spend.

### Expiry (HSD)
Computed when the **SMS is sent** = **send date + 30 days**, formatted `dd/MM/yyyy`
(GMT+7), and written to `Submissions.expiryAt`. The on-screen popup shows the
relative "30 ngày".

### SMS (eSMS)
24h after submission the hourly trigger sends via
`SendMultipleMessage_V4_post_json` with the exact payload
(`Brandname:"MATVIET"`, `SmsType:"2"`, `IsUnicode:0`, `SandBox:0`). Success =
`CodeResult === "100"`; otherwise `ErrorMessage` is logged and the row is marked
`failed`.

Template:
```
Quy Khach than men! Mat Viet gui QK ma {{code}} -300k cho Don Hang tiep theo tu 1tr5. HSD: {{exp}}. Kinh chuc Quy Khach that nhieu suc khoe.
```

---

## Testing (from the Apps Script editor)
- `test_seedDemo()` — seed 4 demo codes.
- `test_doPost()` — two quick calls; the 2nd is `deduped:true` with the **same**
  code (within the 48h window).
- Set `SMS_DELAY_HOURS = 0`, run `test_sendNow()` → a real SMS arrives with
  `HSD = today + 30 days` and `CodeResult:100` in `Logs`. Restore to `24`.

## Notes
- **Dedup key** = `normalizeVNPhone` (mirrored in `lib/phone.ts`).
- **Pool empty** → friendly error + log. Top up by pasting more codes into `Vouchers`.

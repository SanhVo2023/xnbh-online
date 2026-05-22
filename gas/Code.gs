/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Mắt Việt — Online Xác Nhận Bảo Hành  ·  Google Apps Script backend
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  FLOW
 *   - doPost()              receives a submission from the Next.js /api/submit
 *                           proxy, applies a 2-DAY dedup cooldown, allocates one
 *                           pre-generated voucher, sends the SMS immediately
 *                           (HSD = today + 30 days), logs the row.
 *   - sendPendingVouchers() hourly safety-net trigger: re-sends any rows still
 *                           marked "pending" or "failed".
 *   - setup()               one-time: builds sheets + installs the trigger.
 *
 *  SETUP (once, in order):
 *   1) New Google Sheet → Extensions ▸ Apps Script → paste this file.
 *   2) Fill in ESMS_API_KEY / ESMS_SECRET_KEY below (internal tool — keys live
 *      directly in code, per requirement).
 *   3) Run setup() (authorize). Builds Submissions / Vouchers / Config / Logs +
 *      the hourly SMS trigger.
 *   4) Paste your pre-generated codes into the "Vouchers" sheet, column A (row 2↓).
 *   5) Deploy ▸ New deployment ▸ Web app — Execute as: Me · Access: Anyone.
 *      Copy the /exec URL → Netlify env GAS_WEBAPP_URL. Also set Netlify
 *      GAS_SHARED_SECRET to the SHARED_SECRET value below.
 *
 *  Keep normalizeVNPhone() in sync with lib/phone.ts on the frontend.
 * ════════════════════════════════════════════════════════════════════════════
 */

// ── Secrets & config (internal tool — edit these) ─────────────────────────────
var ESMS_API_KEY = "YOUR_ESMS_API_KEY";        // ← paste real eSMS ApiKey
var ESMS_SECRET_KEY = "YOUR_ESMS_SECRET_KEY";  // ← paste real eSMS SecretKey
var BRANDNAME = "MATVIET.VN";                   // registered eSMS Brandname
var SHARED_SECRET = "SET_ME";  // must equal Netlify GAS_SHARED_SECRET (kept out of git; real value is in .env.netlify / the live deployment)

var VOUCHER_VALUE = 300000;       // 300.000đ
var MIN_ORDER = 1500000;          // đơn tối thiểu 1.500.000đ
var EXPIRY_DAYS = 30;             // HSD = send date + 30 days
var DEDUP_WINDOW_HOURS = 48;      // 2-day cooldown: same code within 48h, new after
var TIMEZONE = "GMT+7";

// eSMS Brandname template (non-accented, IsUnicode=0). {{code}} and {{exp}} replaced.
var SMS_TEMPLATE =
  "Quy Khach than men! Mat Viet gui QK ma {{code}} -300k cho Don Hang tiep theo tu 1tr5. HSD: {{exp}}. Kinh chuc Quy Khach that nhieu suc khoe.";

var ESMS_ENDPOINT =
  "http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/";

// ── Sheets ────────────────────────────────────────────────────────────────────
var SHEETS = { submissions: "Submissions", vouchers: "Vouchers", config: "Config", logs: "Logs" };

var SUBMISSION_HEADERS = [
  "timestamp", "hoTen", "phoneRaw", "phoneNorm", "email",
  "voucherCode", "voucherValue", "allocatedAt", "expiryAt",
  "smsStatus", "smsSentAt", "smsResult", "source", "userAgent", "ip",
  "channel",
];
var VOUCHER_HEADERS = ["code", "value", "status", "phoneNorm", "allocatedAt"];

// Paste codes here (one per line) then run seedVouchersFromText(), or paste
// directly into the Vouchers sheet column A.
var SEED_CODES = "";

// ════════════════════════════════════════════════════════════════════════════
//  SETUP
// ════════════════════════════════════════════════════════════════════════════
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sub = ensureSheet_(ss, SHEETS.submissions, SUBMISSION_HEADERS);
  var vou = ensureSheet_(ss, SHEETS.vouchers, VOUCHER_HEADERS);
  ensureSheet_(ss, SHEETS.logs, ["timestamp", "level", "message"]);

  // Config sheet (read-only reference of current settings)
  var cfg = ss.getSheetByName(SHEETS.config);
  if (!cfg) {
    cfg = ss.insertSheet(SHEETS.config);
    cfg.getRange(1, 1, 1, 2).setValues([["setting", "value"]]).setFontWeight("bold");
    cfg.getRange(2, 1, 6, 2).setValues([
      ["voucherValue", VOUCHER_VALUE],
      ["minOrder", MIN_ORDER],
      ["expiryDays", EXPIRY_DAYS],
      ["dedupWindowHours", DEDUP_WINDOW_HOURS],
      ["brandname", BRANDNAME],
      ["smsTemplate", SMS_TEMPLATE],
    ]);
    cfg.setColumnWidth(1, 160);
    cfg.setColumnWidth(2, 620);
    cfg.setFrozenRows(1);
    cfg.getRange("A9").setValue("(Source of truth = constants in Code.gs. This sheet is for reference.)");
  }

  // Store phone columns as TEXT so leading zeros survive (0777… not 777…).
  sub.getRange("C2:D").setNumberFormat("@"); // phoneRaw, phoneNorm
  vou.getRange("D2:D").setNumberFormat("@"); // phoneNorm

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["available", "allocated"], true).build();
  vou.getRange("C2:C").setDataValidation(rule);

  installSmsTrigger_();
  log_("info", "setup() complete. Paste vouchers, set eSMS keys, deploy as Web App.");
  ss.toast("Setup done. Paste vouchers + set eSMS keys, then deploy.", "Mắt Việt XNBH", 8);
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#16235B").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  } else {
    // Migration: append any new trailing headers added since the sheet was built.
    var have = sh.getLastColumn();
    if (have < headers.length) {
      var missing = headers.slice(have);
      sh.getRange(1, have + 1, 1, missing.length).setValues([missing])
        .setFontWeight("bold").setBackground("#16235B").setFontColor("#ffffff");
    }
  }
  return sh;
}

function installSmsTrigger_() {
  var exists = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === "sendPendingVouchers";
  });
  if (!exists) ScriptApp.newTrigger("sendPendingVouchers").timeBased().everyHours(1).create();
}

function seedVouchersFromText() {
  var codes = (SEED_CODES || "").split(/\r?\n/).map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 0; });
  if (!codes.length) throw new Error("SEED_CODES is empty.");
  seedVouchers_(codes);
}

function seedVouchers_(codes) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var vou = ensureSheet_(ss, SHEETS.vouchers, VOUCHER_HEADERS);
  var existing = {};
  if (vou.getLastRow() > 1) {
    vou.getRange(2, 1, vou.getLastRow() - 1, 1).getValues().forEach(function (r) {
      existing[String(r[0]).trim()] = true;
    });
  }
  var rows = codes.filter(function (c) { return !existing[c]; })
    .map(function (c) { return [c, VOUCHER_VALUE, "available", "", ""]; });
  if (rows.length) vou.getRange(vou.getLastRow() + 1, 1, rows.length, VOUCHER_HEADERS.length).setValues(rows);
  log_("info", "Seeded " + rows.length + " vouchers (" + (codes.length - rows.length) + " dupes skipped).");
}

// ════════════════════════════════════════════════════════════════════════════
//  WEB APP
// ════════════════════════════════════════════════════════════════════════════
function doGet() {
  return jsonOut_({ ok: true, service: "matviet-xnbh", ts: new Date().toISOString() });
}

function doPost(e) {
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents || "{}"); } catch (_) {}

    if (SHARED_SECRET && body.secret !== SHARED_SECRET) {
      return jsonOut_({ ok: false, error: "Unauthorized" });
    }

    var phoneNorm = normalizeVNPhone(body.phoneNorm || body.phoneRaw || body.phone);
    if (!phoneNorm) return jsonOut_({ ok: false, error: "Số điện thoại không hợp lệ." });

    var hoTen = String(body.hoTen || "").trim().slice(0, 80);
    var email = String(body.email || "").trim().slice(0, 120);
    var channel = String(body.channel || "").trim().slice(0, 40);

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      // 1) 2-day cooldown dedup — most recent claim for this phone.
      var recent = findRecentClaim_(phoneNorm);
      if (recent && (Date.now() - recent.timestamp) < DEDUP_WINDOW_HOURS * 3600000) {
        return jsonOut_({
          ok: true, deduped: true,
          voucherCode: recent.voucherCode,
          voucherValue: recent.voucherValue || VOUCHER_VALUE,
          expiryDays: EXPIRY_DAYS,
          expiryDate: recent.expiryAt ? String(recent.expiryAt) : "",
        });
      }

      // 2) Allocate a NEW voucher (first claim, or cooldown elapsed).
      var alloc = allocateVoucher_(phoneNorm);
      if (!alloc) {
        notifyPoolEmpty_();
        return jsonOut_({ ok: false, error: "Chương trình tạm hết voucher. Vui lòng liên hệ cửa hàng." });
      }

      // 3) Send the voucher SMS RIGHT AWAY (no delay). HSD = today + 30 days.
      var now = new Date();
      var expStr = Utilities.formatDate(
        new Date(now.getTime() + EXPIRY_DAYS * 86400000), TIMEZONE, "dd/MM/yyyy");
      var content = SMS_TEMPLATE
        .replace(/{{\s*code\s*}}/g, alloc.code)
        .replace(/{{\s*exp\s*}}/g, expStr)
        .replace(/{{\s*name\s*}}/g, hoTen);
      var sms = sendEsmsSms_(phoneNorm, content);

      appendSubmission_({
        hoTen: hoTen, phoneRaw: String(body.phoneRaw || body.phone || ""), phoneNorm: phoneNorm,
        email: email, channel: channel, voucherCode: alloc.code, allocatedAt: alloc.allocatedAt,
        expiryAt: expStr, smsStatus: sms.ok ? "sent" : "failed", smsSentAt: now, smsResult: sms.raw,
        source: String(body.source || ""), userAgent: String(body.userAgent || ""), ip: String(body.ip || ""),
      });

      return jsonOut_({
        ok: true, deduped: false,
        voucherCode: alloc.code, voucherValue: VOUCHER_VALUE, expiryDays: EXPIRY_DAYS, expiryDate: expStr,
      });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    log_("error", "doPost: " + err);
    return jsonOut_({ ok: false, error: "Lỗi hệ thống. Vui lòng thử lại." });
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  CORE
// ════════════════════════════════════════════════════════════════════════════

/** Most-recent submission row for this phone (scans bottom-up), or null. */
function findRecentClaim_(phoneNorm) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.submissions);
  if (sh.getLastRow() < 2) return null;
  var n = sh.getLastRow() - 1;
  var data = sh.getRange(2, 1, n, SUBMISSION_HEADERS.length).getValues();
  var idx = colIdx_(SUBMISSION_HEADERS);
  for (var i = data.length - 1; i >= 0; i--) {
    // Re-normalize the stored value: Sheets may have coerced "0777..." to the
    // number 777... (dropped leading 0), which would break a raw string compare.
    if (normalizeVNPhone(String(data[i][idx.phoneNorm])) === phoneNorm) {
      return {
        voucherCode: data[i][idx.voucherCode],
        voucherValue: data[i][idx.voucherValue],
        expiryAt: data[i][idx.expiryAt],
        timestamp: new Date(data[i][idx.timestamp]).getTime(),
      };
    }
  }
  return null;
}

function allocateVoucher_(phoneNorm) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.vouchers);
  if (sh.getLastRow() < 2) return null;
  var n = sh.getLastRow() - 1;
  var data = sh.getRange(2, 1, n, VOUCHER_HEADERS.length).getValues();
  var idx = colIdx_(VOUCHER_HEADERS);
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][idx.status]).toLowerCase() === "available") {
      var now = new Date();
      sh.getRange(i + 2, idx.status + 1).setValue("allocated");
      sh.getRange(i + 2, idx.phoneNorm + 1).setValue(phoneNorm);
      sh.getRange(i + 2, idx.allocatedAt + 1).setValue(now);
      return { code: String(data[i][idx.code]).trim(), allocatedAt: now };
    }
  }
  return null;
}

function appendSubmission_(o) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.submissions);
  sh.appendRow([
    new Date(), o.hoTen, o.phoneRaw, o.phoneNorm, o.email,
    o.voucherCode, VOUCHER_VALUE, o.allocatedAt, o.expiryAt || "",
    o.smsStatus || "pending", o.smsSentAt || "", o.smsResult || "",
    o.source, o.userAgent, o.ip, o.channel,
  ]);
}

// ════════════════════════════════════════════════════════════════════════════
//  SMS — vouchers are sent immediately in doPost(). This hourly trigger is just a
//  safety net that (re)sends any rows still marked "pending" or "failed".
// ════════════════════════════════════════════════════════════════════════════
function sendPendingVouchers() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.submissions);
    if (sh.getLastRow() < 2) return;

    var n = sh.getLastRow() - 1;
    var data = sh.getRange(2, 1, n, SUBMISSION_HEADERS.length).getValues();
    var idx = colIdx_(SUBMISSION_HEADERS);

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var status = String(row[idx.smsStatus]);
      if (status !== "pending" && status !== "failed") continue;

      // Reuse the stored HSD if present, else HSD = today + 30 days.
      var sendDate = new Date();
      var expStr = row[idx.expiryAt]
        ? String(row[idx.expiryAt])
        : Utilities.formatDate(new Date(sendDate.getTime() + EXPIRY_DAYS * 86400000), TIMEZONE, "dd/MM/yyyy");

      var phone = String(row[idx.phoneNorm] || row[idx.phoneRaw]);
      var content = SMS_TEMPLATE
        .replace(/{{\s*code\s*}}/g, String(row[idx.voucherCode]))
        .replace(/{{\s*exp\s*}}/g, expStr)
        .replace(/{{\s*name\s*}}/g, String(row[idx.hoTen]));

      var result = sendEsmsSms_(phone, content);
      var rowNum = i + 2;
      sh.getRange(rowNum, idx.expiryAt + 1).setValue(expStr);
      sh.getRange(rowNum, idx.smsStatus + 1).setValue(result.ok ? "sent" : "failed");
      sh.getRange(rowNum, idx.smsSentAt + 1).setValue(sendDate);
      sh.getRange(rowNum, idx.smsResult + 1).setValue(result.raw);
      Utilities.sleep(250);
    }
  } catch (err) {
    log_("error", "sendPendingVouchers: " + err);
  } finally {
    lock.releaseLock();
  }
}

function sendEsmsSms_(phone, content) {
  var payload = {
    ApiKey: ESMS_API_KEY,
    SecretKey: ESMS_SECRET_KEY,
    Content: content,
    Phone: phone,
    Brandname: BRANDNAME,
    SmsType: "2",     // 2 = Brandname CSKH
    IsUnicode: 0,     // 0 = non-accented
    SandBox: 0,       // 0 = send for real
    RequestId: "",
    CallbackUrl: "",
  };
  try {
    var res = UrlFetchApp.fetch(ESMS_ENDPOINT, {
      method: "post", contentType: "application/json",
      payload: JSON.stringify(payload), muteHttpExceptions: true,
    });
    var text = res.getContentText();
    var json = {};
    try { json = JSON.parse(text); } catch (_) {}
    var ok = String(json.CodeResult) === "100";
    if (!ok) log_("error", "eSMS fail " + phone + ": " + (json.ErrorMessage || text));
    return { ok: ok, raw: text };
  } catch (err) {
    log_("error", "eSMS exception " + phone + ": " + err);
    return { ok: false, raw: String(err) };
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════════════════════════════════

/** Keep in sync with lib/phone.ts */
function normalizeVNPhone(raw) {
  if (!raw) return null;
  var digits = String(raw).replace(/\D/g, "");
  if (digits.indexOf("0084") === 0) digits = digits.slice(4);
  else if (digits.indexOf("84") === 0 && digits.length >= 11) digits = digits.slice(2);
  if (digits.charAt(0) !== "0") digits = "0" + digits;
  var re = /^0(3[2-9]|5[25689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
  return re.test(digits) ? digits : null;
}

function colIdx_(headers) {
  var m = {};
  headers.forEach(function (h, i) { m[h] = i; });
  return m;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function log_(level, message) {
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.logs);
    if (sh) sh.appendRow([new Date(), level, message]);
  } catch (_) {}
}

function notifyPoolEmpty_() {
  log_("error", "Voucher pool empty!");
}

// ════════════════════════════════════════════════════════════════════════════
//  TESTS (run from the editor)
// ════════════════════════════════════════════════════════════════════════════
function test_seedDemo() {
  seedVouchers_(["MV300-AAA111", "MV300-BBB222", "MV300-CCC333", "MV300-DDD444"]);
}

/** Two quick calls → 2nd is deduped (same code, within 48h cooldown). */
function test_doPost() {
  var fake = { postData: { contents: JSON.stringify({
    secret: SHARED_SECRET, hoTen: "Nguyen Van Test", phoneRaw: "0901234567",
    phoneNorm: "0901234567", email: "t@example.com", source: "test", userAgent: "test", ip: "127.0.0.1",
  }) } };
  Logger.log(doPost(fake).getContent());
  Logger.log(doPost(fake).getContent());
}

/** Set SMS_DELAY_HOURS = 0 temporarily, then run to send a real test SMS. */
function test_sendNow() {
  sendPendingVouchers();
}

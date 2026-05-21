"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { submissionSchema, type SubmitResponse, type SubmitSuccess } from "@/lib/validation";
import Reveal from "./Reveal";
import SuccessModal from "./SuccessModal";
import ChannelSelect from "./ChannelSelect";

type Errors = Partial<Record<"hoTen" | "phone" | "email" | "channel" | "agree", string>>;

const FIELD =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-navy-800 placeholder:text-muted/60 outline-none transition-all duration-200 focus:border-gold-500/70 focus:ring-2 focus:ring-gold-400/30";

export default function WarrantyForm() {
  const [form, setForm] = useState({
    hoTen: "",
    phone: "",
    email: "",
    channel: "",
    agree: false,
    website: "", // honeypot
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SubmitSuccess | null>(null);

  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const parsed = submissionSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json: SubmitResponse = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setServerError(
          (!json.ok && json.error) ||
            "Có lỗi xảy ra, vui lòng thử lại sau ít phút."
        );
        return;
      }

      setStatus("idle");
      setSuccess(json);
      setForm({ hoTen: "", phone: "", email: "", channel: "", agree: false, website: "" });
    } catch {
      setStatus("error");
      setServerError("Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.");
    }
  };

  return (
    <section id="form" className="section-pad relative scroll-mt-20">
      <div className="container-tight">
        <Reveal>
          <div className="mb-7 text-center">
            <span className="eyebrow">Kích hoạt ngay</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Nhận voucher{" "}
              <span className="text-gradient-gold">300.000đ</span>
            </h2>
            <p className="mt-3 text-muted">
              Điền thông tin để xác nhận bảo hành chính hãng.
            </p>
          </div>
        </Reveal>

        <Reveal i={1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-strong rounded-[28px] p-6 shadow-card sm:p-7"
          >
            {/* honeypot — visually hidden, off-screen, not tabbable */}
            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-4">
              <Field label="Họ và tên" error={errors.hoTen}>
                <input
                  type="text"
                  className={FIELD}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  value={form.hoTen}
                  onChange={(e) => set("hoTen", e.target.value)}
                />
              </Field>

              <Field label="Số điện thoại" error={errors.phone}>
                <input
                  type="tel"
                  inputMode="tel"
                  className={FIELD}
                  placeholder="0901 234 567"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>

              <Field label="Email" optional error={errors.email}>
                <input
                  type="email"
                  inputMode="email"
                  className={FIELD}
                  placeholder="email@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>

              <Field label="Kênh mua hàng" error={errors.channel}>
                <ChannelSelect
                  value={form.channel}
                  onChange={(v) => set("channel", v)}
                  invalid={Boolean(errors.channel)}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-navy-700/30 bg-white transition-colors checked:border-gold-400 checked:bg-gold-400"
                    checked={form.agree}
                    onChange={(e) => set("agree", e.target.checked)}
                  />
                  <svg
                    className="pointer-events-none absolute left-0.5 top-0.5 hidden h-4 w-4 text-navy-900 peer-checked:block"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  Tôi đồng ý với{" "}
                  <a
                    href="#terms"
                    className="font-semibold text-gold-600 underline-offset-2 hover:underline"
                  >
                    điều kiện bảo hành
                  </a>{" "}
                  của Mắt Việt.
                </span>
              </label>
              {errors.agree && (
                <p className="text-sm text-red-600">{errors.agree}</p>
              )}
            </div>

            {serverError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {serverError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-gold mt-6 w-full text-base disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900/30 border-t-navy-900" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Xác nhận & nhận voucher
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Thông tin của bạn được bảo mật tuyệt đối.
            </p>
          </form>
        </Reveal>
      </div>

      <SuccessModal data={success} onClose={() => setSuccess(null)} />
    </section>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-navy-700">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted/80">(không bắt buộc)</span>
        ) : (
          <span className="text-gold-500">*</span>
        )}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

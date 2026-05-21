import { z } from "zod";
import { isValidVNPhone } from "./phone";

/**
 * Form payload schema — shared by the client form and the /api/submit route.
 * `website` is a honeypot field: real users never see/fill it; bots do.
 */
export const submissionSchema = z.object({
  hoTen: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ tên của bạn")
    .max(80, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .refine(isValidVNPhone, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .max(120)
    .optional()
    .or(z.literal("")),
  agree: z.literal(true, {
    errorMap: () => ({ message: "Vui lòng đồng ý với điều kiện bảo hành" }),
  }),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export type SubmitSuccess = {
  ok: true;
  deduped: boolean;
  voucherCode: string;
  voucherValue: number;
  expiryDays: number;
  expiryDate?: string;
};

export type SubmitError = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
};

export type SubmitResponse = SubmitSuccess | SubmitError;

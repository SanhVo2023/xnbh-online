/** Shared voucher constants + Terms & Conditions (single source of truth). */

export const VOUCHER_VALUE = 300000;
export const MIN_ORDER = 1500000;
export const EXPIRY_DAYS = 30;

export const MIN_ORDER_LABEL = "1.500.000đ";
export const VOUCHER_LABEL = "300.000đ";

export const VOUCHER_TERMS = {
  apply: {
    title: "Điều kiện áp dụng",
    items: [
      "Đơn hàng có giá trị tối thiểu 1.500.000đ",
      "Hàng nguyên giá",
      "Gọng Kính - Kính Mát - Tròng Kính",
      "Áp dụng trên một hóa đơn",
    ],
  },
  notApply: {
    title: "Không áp dụng",
    items: [
      "Sản phẩm thuộc phiên bản giới hạn",
      "Các thương hiệu: Maui Jim, Cartier, Miu Miu, Prada, Lindberg, Flyer Kids, Kính áp tròng, hàng phụ kiện (bộ nước rửa, dây đeo, khăn lau)",
      "Không quy đổi thành tiền mặt, không được bán cho người khác",
      "Không áp dụng đồng thời với các CTKM, giảm giá, bundles hoặc coupons khác",
    ],
  },
  notes: {
    title: "Lưu ý",
    items: [
      "Chương trình có thể kết thúc hoặc thay đổi bất kỳ lúc nào mà không cần thông báo",
      "Tổng giá trị đơn hàng không tính phụ kiện & phí vận chuyển",
    ],
  },
} as const;

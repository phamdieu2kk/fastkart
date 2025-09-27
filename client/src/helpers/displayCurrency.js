// Hiển thị tiền cho UI (có dấu . và "đ")
export const displayVNDCurrency = (num) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(num * 1000) + "đ"; // nhân 1000 cho giá sản phẩm
};

// Format số tiền chuẩn VNPay (không dấu . , bỏ nhân 1000)
export const formatVNPayAmount = (num) => {
  return Math.round(num); // chỉ dùng số nguyên
};

export default displayVNDCurrency;

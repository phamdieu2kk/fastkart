const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productDetails: {
    type: Array,
    default: [],
  },
  email: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
    default: "",
  },
  vnpayDetails: {
    vnp_TransactionNo: { type: String, default: "" }, // Mã giao dịch VNPAY
    vnp_BankCode: { type: String, default: "" },       // Ngân hàng thanh toán
    vnp_CardType: { type: String, default: "" },       // Loại thẻ (nếu có)
    vnp_Amount: { type: Number, default: 0 },          // Số tiền thanh toán
    vnp_ResponseCode: { type: String, default: "" },   // 00 = thanh toán thành công
    vnpay_status: { type: String, default: "pending" }, // pending, success, failed
    vnpay_method_type: { type: String, default: "vnpay" },
  },
  shipping_options: {
    type: Array,
    default: [],
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const orderModel = mongoose.model('order', orderSchema);

module.exports = orderModel;

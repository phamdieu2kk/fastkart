// config/vnpay.js
require("dotenv").config();

const vnp = {
  tmnCode: process.env.VNP_TMNCODE || "TPT53ZE1",       // VNPay Merchant Code
  hashSecret: process.env.VNP_HASHSECRET || "Q0SKBQ2JRPIS540CQEZYYE3ZFR6C2XRI",  // Secret Key for HMAC
  vnpUrl: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.VNP_RETURN_URL || "http://localhost:3000/vnpay-return", // URL to receive the callback
};

module.exports = vnp;

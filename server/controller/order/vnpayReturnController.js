// controller/order/vnpayReturnController.js
const crypto = require("crypto");
const qs = require("qs");
const orderModel = require("../../models/orderProductModel");
const vnp = require("../../config/vnpay");

const sortObject = (obj) => {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
};

const vnpayReturnController = async (req, res) => {
  try {
    const vnp_Params = req.query;
    console.log("VNPay Return Params:", vnp_Params);

    // Lấy vnp_SecureHash ra để so sánh
    const vnp_SecureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });

    // Tạo lại HMAC
    const hmac = crypto.createHmac("sha512", vnp.hashSecret);
    const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("VNPay HMAC calculated:", checkSum);
    console.log("VNPay HMAC received:  ", vnp_SecureHash);

    if (checkSum === vnp_SecureHash) {
      // HMAC đúng, kiểm tra kết quả thanh toán
      const orderId = vnp_Params.vnp_TxnRef;
      const vnp_ResponseCode = vnp_Params.vnp_ResponseCode; // 00 = success

      const order = await orderModel.findOne({ "vnpayDetails.vnp_TxnRef": orderId });
      if (!order) {
        return res.status(404).json({ message: "Order not found", success: false, params: vnp_Params });
      }

      // Cập nhật trạng thái order
      order.vnpayDetails.vnpay_status = vnp_ResponseCode === "00" ? "success" : "failed";
      order.vnpayDetails.vnp_ResponseCode = vnp_ResponseCode;
      order.vnpayDetails.vnpayParams = vnp_Params;
      await order.save();

      return res.status(200).json({
        success: true,
        message: vnp_ResponseCode === "00" ? "Payment successful" : "Payment failed",
        orderId: order._id,
        vnp_Params,
        vnp_SecureHash: checkSum,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid HMAC, data may be tampered",
        vnp_Params,
        vnp_SecureHashReceived: vnp_SecureHash,
        vnp_SecureHashCalculated: checkSum,
      });
    }
  } catch (error) {
    console.error("VNPay Return Error:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = vnpayReturnController;

const crypto = require("crypto");
const qs = require("qs");
const orderModel = require("../../models/orderProductModel");
const vnp = require("../../config/vnpay");

// Hàm sắp xếp các tham số từ VNPay theo thứ tự chữ cái
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
    const vnp_Params = req.query; // Các tham số từ VNPay trả về
    console.log("VNPay Return Params:", vnp_Params);

    const vnp_SecureHash = vnp_Params.vnp_SecureHash;
    if (!vnp_SecureHash) {
      console.error("vnp_SecureHash not found in params!");
      return res.status(400).json({
        success: false,
        message: "vnp_SecureHash missing from response.",
        vnp_Params,
      });
    }

    // Xoá vnp_SecureHash khỏi tham số trước khi sắp xếp
    delete vnp_Params.vnp_SecureHash;

    // Sắp xếp các tham số và tạo chuỗi HMAC
    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    console.log("Sorted Params for HMAC:", sortedParams);
    console.log("Data to be signed:", signData);

    const hmac = crypto.createHmac("sha512", vnp.hashSecret);
    const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("VNPay HMAC calculated:", checkSum);
    console.log("VNPay HMAC received: ", vnp_SecureHash);

    // Kiểm tra xem HMAC tính toán có khớp với HMAC nhận được không
    if (checkSum === vnp_SecureHash) {
      const orderId = vnp_Params.vnp_TxnRef; // Mã đơn hàng từ VNPay
      const vnp_ResponseCode = vnp_Params.vnp_ResponseCode; // "00" cho giao dịch thành công

      const order = await orderModel.findOne({ "vnpayDetails.vnp_TxnRef": orderId });
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
          success: false,
          vnp_Params,
        });
      }

      // Cập nhật trạng thái đơn hàng dựa trên mã phản hồi từ VNPay
      order.vnpayDetails.vnpay_status = vnp_ResponseCode === "00" ? "success" : "failed";
      order.vnpayDetails.vnp_ResponseCode = vnp_ResponseCode;
      order.vnpayDetails.vnpayParams = vnp_Params;
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment status updated successfully.",
        order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid HMAC, security check failed.",
      });
    }
  } catch (error) {
    console.error("Error in vnpayReturnController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


module.exports = vnpayReturnController;

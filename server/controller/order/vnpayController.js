// controller/order/vnpayController.js
const crypto = require("crypto");
const mongoose = require("mongoose");
const dayjs = require("dayjs"); // sử dụng dayjs thay cho dateformat
const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");
const ProductModel = require("../../models/productModel");
const vnp = require("../../config/vnpay");
const qs = require("qs");

// Helper sort object
const sortObject = (obj) => {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
};

const vnpayController = async (req, res) => {
  try {
    const { cartItems, shippingFee, bankCode } = req.body;

    // ✅ Validate cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // ✅ Validate shippingFee
    const shipping = parseInt(shippingFee) || 0;
    if (shipping < 0) {
      return res.status(400).json({ message: "Invalid shipping fee", success: false });
    }

    // Lấy thông tin user
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    // Lấy thông tin sản phẩm từ DB
    const productIds = cartItems.map((item) => new mongoose.Types.ObjectId(item.productId));
    const productsFromDB = await ProductModel.find({ _id: { $in: productIds } });

    const products = cartItems.map((item) => {
      const product = productsFromDB.find((p) => p._id.toString() === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: product._id,
        quantity: item.quantity,
        sellingPrice: product.sellingPrice,
        productName: product.productName,
        productImage: product.productImage[0],
      };
    });

    const totalProductAmount = products.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    const totalAmount = totalProductAmount + shipping;

    const date = new Date();
    const createDate = dayjs(date).format("YYYYMMDDHHmmss");
    const orderId = dayjs(date).format("HHmmss") + Math.floor(Math.random() * 1000);
    const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp.tmnCode,
      vnp_Amount: totalAmount * 100, // VNPay tính bằng đồng * 100
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toán đơn hàng của ${user.email}`,
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: vnp.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) vnp_Params.vnp_BankCode = bankCode;

    // sort params
    vnp_Params = sortObject(vnp_Params);

    // tạo HMAC
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp.hashSecret);
    const vnp_SecureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params.vnp_SecureHash = vnp_SecureHash;
    const vnpUrl = vnp.vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

    // Lưu đơn hàng pending
    const order = await orderModel.create({
      productDetails: products.map((item) => ({
        productId: item.productId,
        name: item.productName,
        price: item.sellingPrice,
        quantity: item.quantity,
        image: item.productImage,
      })),
      email: user.email,
      userId: user._id,
      shippingFee: shipping,
      vnpayDetails: {
        vnpay_status: "pending",
        vnpay_method_type: "vnpay",
        vnp_TxnRef: orderId,
        vnp_Amount: totalAmount * 100,
      },
      totalAmount,
    });

    // ✅ Debug: in params + HMAC trước khi trả về React / Postman
    console.log("vnp_Params:", vnp_Params);
    console.log("vnp_SecureHash:", vnp_SecureHash);

    return res.status(200).json({
      success: true,
      paymentUrl: vnpUrl,
      orderId: order._id,
      vnp_Params,
      vnp_SecureHash,
    });
  } catch (error) {
    console.error("VNPay Checkout Error:", error);
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

module.exports = vnpayController;

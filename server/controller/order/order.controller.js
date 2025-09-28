// controller/order/orderController.js
const orderModel = require("../../models/orderProductModel");

const orderController = async (req, res) => {
  const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, message: "Order list", data: orders });
};

module.exports = orderController;

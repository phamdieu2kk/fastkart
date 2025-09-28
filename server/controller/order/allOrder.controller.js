// controller/order/allOrderController.js
const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (req, res) => {
  const user = await userModel.findById(req.userId);
  if (user.role !== 'ADMIN') return res.status(403).json({ message: "No access" });

  const allOrders = await orderModel.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: allOrders });
};

module.exports = allOrderController;

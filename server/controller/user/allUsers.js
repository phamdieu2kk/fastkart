const userModel = require("../../models/userModel");

async function allUsers(req, res) {
  try {
    console.log("📌 userid allUsers:", req.userId);

    const users = await userModel.find().sort({ createdAt: -1 }); // mới nhất lên đầu

    return res.status(200).json({
      message: "All users fetched successfully",
      data: users,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("❌ allUsers error:", err);

    return res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}

module.exports = allUsers;

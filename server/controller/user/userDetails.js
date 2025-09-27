const userModel = require("../../models/userModel");

async function userDetailsController(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true
      });
    }

    const user = await userModel.findById(req.userId).select("-password"); // loại bỏ password

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    res.status(200).json({
      data: user,
      success: true,
      error: false,
      message: "User details fetched successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
      success: false,
      error: true
    });
  }
}

module.exports = userDetailsController;

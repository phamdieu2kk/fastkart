const userModel = require("../../models/userModel")

async function updateUser(req, res) {
  try {
    const sessionUser = req.userId
    const { userId, email, name, role } = req.body

    // Kiểm tra session user
    const user = await userModel.findById(sessionUser)
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: Please login again",
        error: true,
        success: false,
      })
    }

    console.log("Session user role:", user.role)

    // Payload update
    const payload = {
      ...(email && { email }),
      ...(name && { name }),
      ...(role && { role }),
    }

    // Kiểm tra có dữ liệu để update không
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
        error: true,
        success: false,
      })
    }

    // Thực hiện update
    const updatedUser = await userModel.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      })
    }

    // Custom message
    let successMessage = "User has been updated successfully"
    if (payload.role && payload.role === "ADMIN") {
      successMessage = "Congratulations! You have been promoted to Admin."
    }

    res.json({
      data: updatedUser,
      message: successMessage,
      success: true,
      error: false,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    })
  }
}

module.exports = updateUser

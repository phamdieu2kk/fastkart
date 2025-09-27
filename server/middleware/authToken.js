// middleware/authToken.js
const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Please login!", success: false, error: true });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired, please login again.", success: false, error: true });
        }
        return res.status(401).json({ message: "Invalid token, please login again.", success: false, error: true });
      }

      req.userId = decoded._id;
      next();
    });
  } catch (err) {
    console.error("Auth token error:", err);
    res.status(500).json({ message: "Server error, please try again later.", success: false, error: true });
  }
}

module.exports = authToken;

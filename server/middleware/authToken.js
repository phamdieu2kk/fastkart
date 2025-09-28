// middleware/authToken.js
const jwt = require("jsonwebtoken");

// Promisified function to verify token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err); // Reject on error
      }
      resolve(decoded); // Resolve with the decoded token if valid
    });
  });
};

async function authToken(req, res, next) {
  try {
    // Extract token from cookies or authorization header
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    
    // If token is not found, return an error
    if (!token) {
      return res.status(401).json({ message: "Please login!", success: false, error: true });
    }

    // Verify the token asynchronously
    const decoded = await verifyToken(token);

    // Attach the user ID from the decoded token to the request object
    req.userId = decoded._id;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Auth token error:", err);

    // Handle different JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again.", success: false, error: true });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, please login again.", success: false, error: true });
    }

    // Handle unexpected errors
    res.status(500).json({ message: "Server error, please try again later.", success: false, error: true });
  }
}

module.exports = authToken;

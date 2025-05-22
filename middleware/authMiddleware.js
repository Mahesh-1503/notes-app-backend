const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    // Extract token from Authorization header
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.userId) {
        throw new Error("Invalid token payload");
      }
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      console.error("JWT verification error:", {
        error: jwtError.message,
        token: token.substring(0, 20) + '...' // Log only first 20 chars for security
      });
      return res.status(401).json({ message: "Token is not valid" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
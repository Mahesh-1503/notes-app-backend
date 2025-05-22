const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth Headers:', req.headers);
    const authHeader = req.header("Authorization");
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ message: "No authorization header" });
    }

    // Extract token from Authorization header
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'undefined');
    
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      console.log('Attempting to verify token with JWT_SECRET');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      if (!decoded.userId) {
        console.log('Token payload missing userId');
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
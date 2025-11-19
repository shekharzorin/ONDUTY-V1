import jwt from "jsonwebtoken";
import user from "../models/User.js"; // ✅ import merged model but use lowercase 'user'

// Middleware: Verify JWT token and attach user to request
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const foundUser = await user.findById(decoded.id);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // Attach user info to request
    req.user = foundUser;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

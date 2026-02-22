import jwt from "jsonwebtoken";
import user from "../models/User.js";

// Middleware: Verify JWT token and attach user to request
export const verifyToken = async (req, res, next) => {
  try {
    // Log the secret being used here
    // console.log("🔐 JWT_SECRET during verify:", process.env.JWT_SECRET);

    const authHeader = req.headers.authorization;

    // Log authorization header from frontend
    // console.log("🔍 Received Authorization header:", authHeader);

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // console.log("🪙 Extracted Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("✅ Decoded Token:", decoded);

    // Find user in database
    const foundUser = await user.findById(decoded.id);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // Attach user info to request
    req.user = foundUser;
    next();

  } catch (err) {
    console.error("❌ Token verification error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

import User, { planFeatures } from "../models/User.js";

// Middleware: check if the user has access to the report feature
export const checkReportAccess = () => {
  return async (req, res, next) => {
    try {
      let adminEmail;

      // Determine which admin to check based on role
      if (req.user.role === "admin") {
        adminEmail = req.user.email;
      } else if (req.user.role === "employee") {
        adminEmail = req.user.adminEmail;
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized role" });
      }

      // Find the admin user
      const admin = await User.findOne({ email: adminEmail });
      if (!admin)
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });

      // Check if the admin's plan allows report access
      if (!admin.plan || !planFeatures[admin.plan]?.report) {
        return res.status(403).json({
          success: false,
          message: "Access denied: admin's plan does not allow report feature",
        });
      }

      // Everything is okay, proceed to the next middleware
      next();
    } catch (err) {
      console.error("Report access check error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to verify admin plan",
        error: err.message || err,
      });
    }
  };
};

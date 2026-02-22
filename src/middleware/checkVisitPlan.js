import User, { planFeatures } from "../models/User.js";

export const checkVisitAccess = () => {
  return async (req, res, next) => {
    try {
      let adminEmail;

      if (req.user.role === "admin") {
        adminEmail = req.user.email;
      } else if (req.user.role === "employee") {
        adminEmail = req.user.adminEmail;
      } else {
        return res.status(403).json({ success: false, message: "Unauthorized role" });
      }

      const admin = await User.findOne({ email: adminEmail });
      if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

      if (!admin.plan || !planFeatures[admin.plan]?.visit) {
        return res.status(403).json({
          success: false,
          message: "Access denied: admin's plan does not allow visit feature",
        });
      }

      next();
    } catch (err) {
      console.error("Visit access check error:", err);
      res.status(500).json({ success: false, message: "Failed to verify admin plan", error: err });
    }
  };
};

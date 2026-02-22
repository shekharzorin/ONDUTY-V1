import User, { planFeatures } from "../models/User.js";

export const checkLocationPlan = () => {
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
      if (!admin)
        return res.status(404).json({ success: false, message: "Admin not found" });

      const plan = admin.plan;
      if (!plan || !planFeatures[plan]?.liveLocation) {
        return res.status(403).json({
          success: false,
          message: "Access denied: admin's plan does not include live location feature",
        });
      }

      next();
    } catch (err) {
      console.error("Location plan check error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to verify admin plan",
        error: err.message,
      });
    }
  };
};

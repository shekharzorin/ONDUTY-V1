import User, { planFeatures } from "../models/User.js";

export const checkEmployeeTrackingPlan = async (req, res, next) => {
  try {
    const employeeEmail = req.user.email; // from token
    const employee = await User.findOne({ email: employeeEmail });
    if (!employee || !employee.adminEmail)
      return res.status(404).json({ success: false, message: "Employee or admin not found" });

    const admin = await User.findOne({ email: employee.adminEmail });
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    // Check plan access
    const plan = admin.plan;
    if (!planFeatures[plan]?.employeeTrackingHistory)
      return res.status(403).json({
        success: false,
        message: "Admin's plan does not include employee tracking history.",
      });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Error verifying plan", error: err.message });
  }
};

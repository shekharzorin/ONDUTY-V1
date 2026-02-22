import express from "express";
import User, { planFeatures } from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";
import { verifyToken } from "../middleware/verifyToken.js";
import Plan from "../models/Plan.js";

const router = express.Router();

/* -------------------- Middleware: Check plan feature -------------------- */
export const checkFeature = (feature) => (req, res, next) => {
  const { plan } = req.user;
  if (!planFeatures[plan] || !planFeatures[plan][feature]) {
    return res.status(403).json({
      message: `Your ${plan} plan does not allow this feature.`,
    });
  }
  next();
};

/* -------------------- Middleware: Ensure user is admin -------------------- */
export const isAdmin = async (req, res, next) => {
  try {
    const admin = await User.findOne({ email: req.user.email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can access this route." });
    }
    req.user = admin;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- Upgrade Plan -------------------- */
router.post("/upgrade-plan", verifyToken, async (req, res) => {
  try {
    const { plan, planType } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // 🚫 Prevent using the free/trial plan more than once
    if (plan === "trial" && user.hasUsedFreePlan) {
      return res.status(403).json({
        success: false,
        message: "You have already used your free trial plan.",
      });
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);

    if (planType === "monthly") expiryDate.setMonth(expiryDate.getMonth() + 1);
    else if (planType === "yearly")
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    else if (plan === "trial") expiryDate.setDate(expiryDate.getDate() + 7); // 🆓 trial = 7 days

    // ✅ Update user plan
    user.plan = plan;
    user.planType = planType || null;
    user.planStart = startDate;
    user.planExpiry = expiryDate;
    user.role = "admin"; // Automatically become admin after upgrade
    user.isPaid = plan !== "trial"; // Mark paid only for paid plans
    user.emailReminderSent = false;

    // ✅ Mark trial as used
    if (plan === "trial") user.hasUsedFreePlan = true;

    await user.save();

    // 📩 Send confirmation email
    await sendEmail(
      user.email,
      "Plan Upgraded Successfully",
      `Hello ${
        user.name
      }, your ${plan} plan is active until ${expiryDate.toDateString()}.`
    );

    res.json({
      success: true,
      message: "Plan upgraded successfully",
      plan: user.plan,
      planExpiry: expiryDate,
    });
  } catch (err) {
    console.error("❌ Error upgrading plan:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* -------------------- Add Employee -------------------- */
router.post(
  "/add-employee",
  verifyToken,
  isAdmin,
  checkFeature("addEmployees"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const admin = await User.findOne({ email: req.user.email });

      if (!admin) return res.status(404).json({ message: "Admin not found" });
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const employee = new User({
        name,
        email,
        password,
        role: "employee",
        adminEmail: admin.email,
        plan: "none",
        isPaid: false,
      });

      await employee.save();

      await sendEmail(
        email,
        "Welcome to OnDuty",
        `Hello ${name}, you were added to ${admin.name}'s company.`
      );

      res.json({
        success: true,
        message: "Employee added successfully",
        employee,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* -------------------- Get All Employees of Logged-in Admin -------------------- */
router.get("/employees", verifyToken, isAdmin, async (req, res) => {
  try {
    const employees = await User.find({ adminEmail: req.user.email }).select(
      "-password"
    );
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* -------------------- Delete Employee -------------------- */
router.delete(
  "/employee/:employeeEmail",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { employeeEmail } = req.params;

      const employee = await User.findOneAndDelete({
        email: employeeEmail,
        adminEmail: req.user.email,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found or unauthorized",
        });
      }

      res.json({ success: true, message: "Employee deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* -------------------- Get All Plans -------------------- */
router.get("/", async (req, res) => {
  try {
    const plansFromDB = await Plan.find().lean();

    const plans = plansFromDB.map((plan) => ({
      planName: plan.planName,
      price: plan.price,
      features: planFeatures[plan.planName],
    }));

    res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      plans,
    });
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
});

/* -------------------- Get Logged-in User -------------------- */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

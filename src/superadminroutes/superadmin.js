import express from "express";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import AdminTrack from "../models/Admintrack.js";
import verifySuperAdmin from "../superadminmiddleware/verifySuperAdmin.js";

const router = express.Router();

/**
 * ==============================
 *  ADMIN ROUTES (SUPER ADMIN ONLY)
 * ==============================
 */

/* =======================================================
   1️⃣ GET ALL ADMINS
========================================================= */
router.get("/", verifySuperAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    const profiles = await Profile.find();
    const tracks = await AdminTrack.find();

    const formatDate = (date) => {
      if (!date) return null;
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const mergedAdmins = admins.map((admin) => {
      const profile = profiles.find((p) => p.email === admin.email);
      const track = tracks.find((t) => t.email === admin.email);

      return {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        plan: admin.plan,
        planType: admin.planType,
        isPaid: admin.isPaid,
        createdAt: formatDate(admin.createdAt),
        updatedAt: track ? formatDate(track.updatedAt) : null,

        profile: profile
          ? {
              mobile: profile.mobile,
              image:
                profile.profilePic && profile.imageType
                  ? `data:${profile.imageType};base64,${profile.profilePic.toString("base64")}`
                  : null,
            }
          : null,

        tracking: track
          ? {
              address: track.address || "Unknown",
              status: track.status || "inactive",
              lastUpdated: formatDate(track.updatedAt),
            }
          : {
              address: "Unknown",
              status: "inactive",
              lastUpdated: null,
            },
      };
    });

    const trialCount = mergedAdmins.filter(
      (admin) => admin.plan === "trial"
    ).length;

    res.status(200).json({
      success: true,
      count: mergedAdmins.length,
      trialCount,
      data: mergedAdmins,
    });
  } catch (err) {
    console.error("❌ Error fetching admins:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server error",
      error: err.message,
    });
  }
});

/* =======================================================
   2️⃣ CREATE ADMIN
========================================================= */
router.post("/", verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, plan, planType } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "❌ User already exists",
      });
    }

    if (plan === "trial") {
      const usedFreePlan = await User.findOne({
        email,
        hasUsedFreePlan: true,
      });
      if (usedFreePlan) {
        return res.status(400).json({
          success: false,
          message: "❌ This user has already used a free/trial plan",
        });
      }
    }

    const planStart = new Date();
    const planExpiry = new Date(planStart);

    if (planType === "monthly") planExpiry.setMonth(planExpiry.getMonth() + 1);
    else if (planType === "yearly") planExpiry.setFullYear(planExpiry.getFullYear() + 1);
    else if (plan === "trial") planExpiry.setDate(planExpiry.getDate() + 7);

    const newAdmin = await User.create({
      name,
      email,
      password,
      role: "admin",
      plan,
      planType,
      planStart,
      planExpiry,
      isPaid: plan !== "trial",
      hasUsedFreePlan: plan === "trial",
      emailReminderSent: false,
    });

    res.status(201).json({
      success: true,
      message: "✅ Admin created successfully",
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        plan: newAdmin.plan,
        planType: newAdmin.planType,
        planStart: newAdmin.planStart,
        planExpiry: newAdmin.planExpiry,
        isPaid: newAdmin.isPaid,
        hasUsedFreePlan: newAdmin.hasUsedFreePlan,
      },
    });
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server error",
      error: err.message,
    });
  }
});

/* =======================================================
   3️⃣ UPDATE ADMIN
========================================================= */
router.put("/:id", verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, plan, planType } = req.body;

    const admin = await User.findOne({ _id: req.params.id, role: "admin" });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "❌ Admin not found",
      });
    }

    if (plan === "trial" && admin.hasUsedFreePlan) {
      return res.status(400).json({
        success: false,
        message: "❌ This user has already used a free/trial plan",
      });
    }

    if (plan) {
      const planStart = new Date();
      const planExpiry = new Date(planStart);

      if (plan === "trial") {
        planExpiry.setDate(planExpiry.getDate() + 7);
        admin.isPaid = false;
        admin.hasUsedFreePlan = true;
        admin.planType = undefined;
      } else {
        admin.isPaid = true;
        admin.planType = planType || "monthly";
        if (admin.planType === "monthly")
          planExpiry.setMonth(planExpiry.getMonth() + 1);
        else planExpiry.setFullYear(planExpiry.getFullYear() + 1);
      }

      admin.plan = plan;
      admin.planStart = planStart;
      admin.planExpiry = planExpiry;
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    const updatedAdmin = admin.toObject();
    delete updatedAdmin.password;

    res.json({
      success: true,
      message: "✅ Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (err) {
    console.error("❌ Error updating admin:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server error",
      error: err.message,
    });
  }
});

/* =======================================================
   4️⃣ DELETE ADMIN
========================================================= */
router.delete("/:id", verifySuperAdmin, async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "admin",
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "❌ Admin not found",
      });
    }

    res.json({
      success: true,
      message: "✅ Admin deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting admin:", err);
    res.status(500).json({
      success: false,
      message: "❌ Server error",
      error: err.message,
    });
  }
});

export default router;

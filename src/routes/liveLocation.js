// src/routes/liveLocation.js
import express from "express";
import LiveLocation from "../models/LiveLocation.js";
import LocationHistory from "../models/LocationHistory.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkLocationPlan } from "../middleware/checkLocationPlan.js";
import { isMapEnabled } from "../services/settingService.js";

const router = express.Router();

/* ============================================================
   🔹 POST /location/post
   → Employees post (or update) their live location
=============================================================== */
router.post("/post", verifyToken, checkLocationPlan(), async (req, res) => {
  try {
    // ✅ CHECK IF MAP ENABLED BY SUPER ADMIN
    const enabled = await isMapEnabled();
    if (!enabled) {
      return res.status(403).json({
        success: false,
        message: "Location tracking disabled by super admin",
      });
    }

    const { latitude, longitude } = req.body;
    const email = req.user.email;

    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const employee = await User.findOne({ email });
    if (!employee || employee.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Only employees can post location",
      });
    }

    // 1️⃣ Update or insert latest live location
    const liveLocation = await LiveLocation.findOneAndUpdate(
      { employeeEmail: email },
      {
        employeeName: employee.name,
        employeeEmail: email,
        adminEmail: employee.adminEmail,
        latitude,
        longitude,
        updatedAt: new Date(),
      },
      { new: true, upsert: true },
    );

    // 2️⃣ Save history record
    await LocationHistory.create({
      employeeName: employee.name,
      employeeEmail: email,
      adminEmail: employee.adminEmail,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    // 3️⃣ Emit WebSocket event to the admin room
    const io = req.app.get("io");
    io.to(employee.adminEmail).emit("locationUpdate", {
      employeeName: employee.name,
      employeeEmail: email,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Live location and history updated successfully",
      liveLocation,
    });
  } catch (err) {
    console.error("❌ Error saving location:", err);
    res.status(500).json({
      success: false,
      message: "Error saving location",
      error: err.message,
    });
  }
});

/* ============================================================
   🔹 GET /location/live
   → Admin fetches all live employee locations under them
=============================================================== */
router.get("/live", verifyToken, checkLocationPlan(), async (req, res) => {
  try {
    const email = req.user.email;
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route",
      });
    }

    const locations = await LiveLocation.find({ adminEmail: email }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      total: locations.length,
      locations,
    });
  } catch (err) {
    console.error("❌ Error fetching live locations:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching live locations",
      error: err.message,
    });
  }
});

/* ============================================================
   🔹 GET /location/live/:employeeEmail
   → Admin fetches the live location of one employee
=============================================================== */
router.get(
  "/live/:employeeEmail",
  verifyToken,
  checkLocationPlan(),
  async (req, res) => {
    try {
      const adminEmail = req.user.email;
      const { employeeEmail } = req.params;
      const admin = await User.findOne({ email: adminEmail });
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admins can access this route",
        });
      }

      const employeeLive = await LiveLocation.findOne({
        adminEmail,
        employeeEmail,
      });
      if (!employeeLive) {
        return res.status(404).json({
          success: false,
          message: "Live location not found for this employee",
        });
      }

      res.status(200).json({ success: true, employeeLive });
    } catch (err) {
      console.error("❌ Error fetching specific live location:", err);
      res.status(500).json({
        success: false,
        message: "Error fetching specific employee live location",
        error: err.message,
      });
    }
  },
);

/* ============================================================
   🔹 GET /location/history
   → Admin fetches location history for a specific employee
=============================================================== */
router.get("/history", verifyToken, checkLocationPlan(), async (req, res) => {
  try {
    const adminEmail = req.user.email;
    const { employeeEmail, startDate, endDate } = req.query;

    const admin = await User.findOne({ email: adminEmail });
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route",
      });
    }

    if (!employeeEmail) {
      return res.status(400).json({
        success: false,
        message: "Employee email is required",
      });
    }

    const filter = { adminEmail, employeeEmail };
    if (startDate && endDate)
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };

    const history = await LocationHistory.find(filter).sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      total: history.length,
      history,
    });
  } catch (err) {
    console.error("❌ Error fetching location history:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching location history",
      error: err.message,
    });
  }
});

export default router;

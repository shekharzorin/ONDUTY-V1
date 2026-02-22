import express from "express";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ---------------- POST /dashboard/action ---------------- */
router.post("/action", verifyToken, async (req, res) => {
  try {
    const {
      type,
      dateString,
      timeString,
      workedHours,
      clientName,
      fromLocation,
      toLocation,
      status,
    } = req.body;

    const employeeEmail = req.user.email;

    /* ---------------- Validation ---------------- */
    if (!type || !dateString || !timeString) {
      return res.status(400).json({
        success: false,
        message: "type, dateString and timeString are required",
      });
    }

    /* ---------------- Employee ---------------- */
    const employee = await User.findOne({ email: employeeEmail });
    if (!employee || employee.role !== "employee") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    const adminEmail = employee.adminEmail;
    if (!adminEmail) {
      return res.status(400).json({
        success: false,
        message: "Employee not linked to any admin",
      });
    }

    const finalStatus = status || employee.status || "Active";

    /* ------------------------------------------------------------------
       CLIENT CHECK-IN / CHECK-OUT VALIDATION
       Employee must be CURRENTLY clocked-in
    ------------------------------------------------------------------ */
    if (type === "client-check-in" || type === "client-check-out") {
      const lastClockIn = await Activity.findOne({
        employeeEmail,
        dateString,
        type: "clock-in",
      }).sort({ createdAt: -1 });

      const lastClockOut = await Activity.findOne({
        employeeEmail,
        dateString,
        type: "clock-out",
      }).sort({ createdAt: -1 });

      if (
        !lastClockIn ||
        (lastClockOut && lastClockOut.createdAt > lastClockIn.createdAt)
      ) {
        return res.status(403).json({
          success: false,
          message: "Please clock-in before client check-in/out",
        });
      }
    }

    /* ---------------- Prepare Activity Data ---------------- */
    const activityData = {
      employeeName: employee.name,
      employeeEmail,
      adminEmail,
      type,
      dateString,
      timeString,
      fromLocation,
      toLocation,
      status: finalStatus,
    };

    switch (type) {
      case "clock-in":
        activityData.clockInTime = timeString;
        break;

      case "clock-out":
        activityData.clockOutTime = timeString;
        activityData.workedHours = workedHours;
        break;

      case "client-check-in":
        activityData.clientCheckInTime = timeString;
        activityData.clientName = clientName || "Unknown Client";
        break;

      case "client-check-out":
        activityData.clientCheckOutTime = timeString;
        activityData.clientName = clientName || "Unknown Client";
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid action type" });
    }

    /* ---------------- Save Activity ---------------- */
    const activity = await Activity.create(activityData);

    /* ---------------- Update Employee Status ---------------- */
    if (status === "Active" || status === "Inactive") {
      await User.updateOne(
        { email: employeeEmail },
        { status }
      );
    }

    /* ---------------- Notify Admin ---------------- */
    await Notification.create({
      adminEmail,
      employeeName: employee.name,
      employeeEmail,
      type,
      date: dateString,
      time: timeString,
    });

    /* ---------------- Response ---------------- */
    return res.status(201).json({
      success: true,
      message: "Activity stored successfully",
      activity,
    });

  } catch (err) {
    console.error("❌ Error storing activity:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* ---------------- GET /dashboard/admin ---------------- */
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const adminEmail = req.user.email;

    const admin = await User.findOne({ email: adminEmail });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can access" });
    }

    /* ---------------- Employees ---------------- */
    const employees = await User.find({ adminEmail }).select("email name");
    const employeeEmails = employees.map((e) => e.email);

    const totalEmployees = employees.length;

    /* ----------------------------------------------------
       🔥 CRITICAL FIX: MATCH FRONTEND DATE FORMAT
       Frontend sends & stores → YYYY-MM-DD
    ---------------------------------------------------- */
    const today = new Date().toISOString().split("T")[0];
    // example: "2025-12-24"

    /* ---------------- Attendance (Present Count) ---------------- */
    const presentEmployees = await Activity.distinct("employeeEmail", {
      adminEmail,
      employeeEmail: { $in: employeeEmails },
      type: "clock-in",
      dateString: today,
    });

    const todayClockInCount = presentEmployees.length;

    /* ---------------- Activities Grouped By Date ---------------- */
    const activities = await Activity.aggregate([
      {
        $match: {
          adminEmail,
          employeeEmail: { $in: employeeEmails },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$dateString",
          activities: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    /* ---------------- Response ---------------- */
    return res.status(200).json({
      success: true,
      totalEmployees,
      todayClockInCount, // ✅ PRESENT COUNT
      activities,
    });

  } catch (err) {
    console.error("❌ Error fetching admin dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* ---------------- GET /dashboard/activities ---------------- */
router.get("/activities", verifyToken, async (req, res) => {
  try {
    const employeeEmail = req.user.email;

    const activities = await Activity.find({ employeeEmail }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, activities });
  } catch (err) {
    console.error("❌ Error fetching activities:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

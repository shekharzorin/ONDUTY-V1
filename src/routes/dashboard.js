import express from "express";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ---------------- Helper Functions ---------------- */
const formatTime = (date = new Date()) => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const formatDate = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

/* ---------------- POST /dashboard/action ---------------- */
/* ---------------- POST /dashboard/action ---------------- */
router.post("/action", verifyToken, async (req, res) => {
  try {
    const { type, workedHours, clientName, fromLocation, toLocation, status } = req.body;
    const employeeEmail = req.user.email;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: type",
      });
    }

    // ✅ Find employee and linked admin
    const employee = await User.findOne({ email: employeeEmail });
    if (!employee || employee.role !== "employee") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    const adminEmail = employee.adminEmail;
    if (!adminEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Employee not linked to any admin" });
    }

    // ✅ Auto-generate date & time
    const now = new Date();
    const dateString = formatDate(now);
    const timeString = formatTime(now);

    // ✅ Prepare activity data
    const finalStatus = status || employee.status || "Active"; // ensure status always exists
    const activityData = {
      employeeName: employee.name,
      employeeEmail: employee.email,
      adminEmail,
      type,
      dateString,
      timeString,
      fromLocation,
      toLocation,
      status: finalStatus,
    };

    // 🚫 Restrict client actions if employee is inactive
    if (
      (type === "client-check-in" || type === "client-check-out") &&
      (employee.status !== "Active" && status !== "Active")
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot perform client check-in/out while status is Inactive.",
      });
    }

    // ⏰ Handle based on type
    switch (type) {
      case "clock-in":
        activityData.clockInTime = timeString;
        activityData.status = finalStatus; // ✅ ensure stored
        break;

      case "clock-out":
        activityData.clockOutTime = timeString;
        activityData.workedHours = workedHours;
        activityData.status = finalStatus; // ✅ ensure stored
        break;

      case "client-check-in":
        activityData.clientCheckInTime = timeString;
        activityData.clientName = clientName;
        activityData.status = finalStatus; // ✅ ensure stored
        break;

      case "client-check-out":
        activityData.clientCheckOutTime = timeString;
        activityData.clientName = clientName;
        activityData.status = finalStatus; // ✅ ensure stored
        break;

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid action type" });
    }

    // ✅ Create Activity record
    const activity = await Activity.create(activityData);

    // ✅ Update user's status only if manually provided
    if (status === "Active" || status === "Inactive") {
      await User.updateOne({ email: employeeEmail }, { status });
    }

    // ✅ Notify Admin
    await Notification.create({
      adminEmail,
      employeeName: employee.name,
      employeeEmail,
      type,
      date: dateString,
      time: timeString,
    });

    res.status(201).json({
      success: true,
      message: "Activity stored successfully with status validation",
      activity,
    });
  } catch (err) {
    console.error("❌ Error storing activity:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------- GET /dashboard/activities (Employee View) ---------------- */
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

/* ---------------- GET /dashboard/admin (Admin View - date grouped) ---------------- */
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const adminEmail = req.user.email;

    const admin = await User.findOne({ email: adminEmail });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can access this route" });
    }

    // ✅ Fetch all employees under this admin
    const employees = await User.find({ adminEmail }).select("email name status");
    const employeeEmails = employees.map((emp) => emp.email);

    // ✅ Count total employees
    const totalEmployees = employees.length;

    // ✅ Today’s date string
    const today = formatDate(new Date());

    // ✅ Count unique employees who clocked in today (attendance)
    const todayClockInData = await Activity.aggregate([
      {
        $match: {
          adminEmail,
          employeeEmail: { $in: employeeEmails },
          dateString: today,
          type: "clock-in",
        },
      },
      {
        $group: {
          _id: "$employeeEmail", // unique employee
        },
      },
    ]);

    const todayClockInCount = todayClockInData.length;

    // ✅ Group activities by dateString for admin dashboard
    const activities = await Activity.aggregate([
      { $match: { adminEmail, employeeEmail: { $in: employeeEmails } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$dateString",
          activities: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      totalEmployees,
      todayClockInCount,
      activities,
    });
  } catch (err) {
    console.error("❌ Error fetching admin activities:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

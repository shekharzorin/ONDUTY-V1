import express from "express";
import multer from "multer";
import sharp from "sharp";
import Visit from "../models/visit.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkVisitAccess } from "../middleware/checkVisitPlan.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------------- Helper: format time and date ---------------- */
const formatTime = (date) => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${
    (d.getMonth() + 1).toString().padStart(2, "0")
  }/${d.getFullYear()}`;
};

/* ---------------- Helper: process image ---------------- */
const processImage = async (buffer) => {
  const MAX_SIZE = 500 * 1024; // 500 KB
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;

  // Start with full HD resize and high quality
  let quality = 95;
  let resizedBuffer = await sharp(buffer)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside" })
    .jpeg({ quality })
    .toBuffer();

  // Gradually reduce quality if size exceeds limit
  while (resizedBuffer.length > MAX_SIZE && quality > 30) {
    quality -= 5;
    resizedBuffer = await sharp(buffer)
      .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  // If still too large, scale down dimensions proportionally
  let width = MAX_WIDTH;
  let height = MAX_HEIGHT;
  while (resizedBuffer.length > MAX_SIZE && width > 800 && height > 600) {
    width = Math.floor(width * 0.9);
    height = Math.floor(height * 0.9);
    resizedBuffer = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  if (resizedBuffer.length > MAX_SIZE) {
    throw new Error("Image too large after compression (~500 KB max)");
  }

  return resizedBuffer;
};


/* ---------------- POST /visit/post ---------------- */
router.post("/post", verifyToken, checkVisitAccess(), upload.single("image"), async (req, res) => {
  try {
    const { taskName, type, notes, status, date } = req.body;
    const userEmail = req.user.email;

    const employee = await User.findOne({ email: userEmail });
    if (!employee || employee.role !== "employee") {
      return res.status(403).json({ success: false, message: "Only employees can add visits" });
    }

    let image = null;
    let imageType = null;
    if (req.file) {
      try {
        image = await processImage(req.file.buffer);
        imageType = "image/jpeg";
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    const newVisit = new Visit({
      employeeName: employee.name,
      employeeEmail: employee.email,
      adminEmail: employee.adminEmail,
      taskName,
      type,
      notes,
      status: status ? status.toLowerCase() : "pending",
      date,
      image,
      imageType,
    });

    await newVisit.save();

    // Notify admin
    if (employee.adminEmail) {
      await Notification.create({
        adminEmail: employee.adminEmail,
        employeeName: employee.name,
        employeeEmail: employee.email,
        type: status?.toLowerCase() === "completed" ? "task-completed" : "task-added",
        date: formatDate(new Date()),
        time: formatTime(new Date()),
      });
    }

    res.json({ success: true, message: "Visit added successfully", visit: newVisit });
  } catch (err) {
    console.error("Error creating visit:", err);
    res.status(500).json({ success: false, message: "Failed to create visit", error: err });
  }
});

/* ---------------- GET /visit/get (Employee’s visits) ---------------- */
router.get("/get", verifyToken, checkVisitAccess(), async (req, res) => {
  try {
    const userEmail = req.user.email;

    const visits = await Visit.find({ employeeEmail: userEmail })
      .select("-image")
      .sort({ createdAt: -1 });

    const completedCount = await Visit.countDocuments({
      employeeEmail: userEmail,
      status: { $regex: /^completed$/i },
    });

    res.json({ success: true, visits, totalVisits: visits.length, completed: completedCount });
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ success: false, message: "Failed to fetch visits", error: err });
  }
});

/* ---------------- GET /visit/admin ---------------- */
router.get("/admin", verifyToken, checkVisitAccess(), async (req, res) => {
  try {
    const adminEmail = req.user.email;
    const admin = await User.findOne({ email: adminEmail });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { employeeEmail } = req.query;
    const query = { adminEmail };

    // If admin wants visits for a specific employee
    if (employeeEmail) {
      query.employeeEmail = employeeEmail;
    }

    const visits = await Visit.find(query).select("-image").sort({ createdAt: -1 });

    const totalVisits = visits.length;
    const completedCount = visits.filter(
      (v) => v.status?.toLowerCase() === "completed"
    ).length;

    // If all employees requested
    let employeeStats = [];
    if (!employeeEmail) {
      const statsMap = {};
      visits.forEach((v) => {
        if (!statsMap[v.employeeEmail]) {
          statsMap[v.employeeEmail] = {
            employeeName: v.employeeName,
            employeeEmail: v.employeeEmail,
            totalVisits: 0,
            completed: 0,
          };
        }
        statsMap[v.employeeEmail].totalVisits++;
        if (v.status?.toLowerCase() === "completed") {
          statsMap[v.employeeEmail].completed++;
        }
      });
      employeeStats = Object.values(statsMap);
    }

    res.json({
      success: true,
      visits,
      totalVisits,
      completed: completedCount,
      employees: employeeStats,
    });
  } catch (err) {
    console.error("Error fetching admin visits:", err);
    res.status(500).json({ success: false, message: "Failed to fetch visits", error: err });
  }
});

/* ---------------- GET /visit/image/:id ---------------- */
router.get("/image/:id", verifyToken, checkVisitAccess(), async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit || !visit.image) return res.status(404).send("No image found for this visit");
    res.contentType(visit.imageType);
    res.send(visit.image);
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ message: "Failed to fetch image", error: err });
  }
});

/* ---------------- DELETE /visit/delete/:id ---------------- */
router.delete("/delete/:id", verifyToken, checkVisitAccess(), async (req, res) => {
  try {
    const userEmail = req.user.email;
    const deleted = await Visit.findOneAndDelete({ _id: req.params.id, employeeEmail: userEmail });

    if (!deleted) return res.status(404).json({ success: false, message: "Visit not found" });
    res.json({ success: true, message: "Visit deleted successfully" });
  } catch (err) {
    console.error("Error deleting visit:", err);
    res.status(500).json({ success: false, message: "Failed to delete visit", error: err });
  }
});

/* ---------------- PUT /visit/put/:id ---------------- */
router.put("/put/:id", verifyToken, checkVisitAccess(), upload.single("image"), async (req, res) => {
  try {
    const { taskName, type, notes, status, date } = req.body;
    const userEmail = req.user.email;

    const visit = await Visit.findOne({ _id: req.params.id, employeeEmail: userEmail });
    if (!visit) return res.status(404).json({ success: false, message: "Visit not found" });

    if (req.file) {
      visit.image = await processImage(req.file.buffer);
      visit.imageType = "image/jpeg";
    }

    visit.taskName = taskName || visit.taskName;
    visit.type = type || visit.type;
    visit.notes = notes || visit.notes;
    visit.status = status ? status.toLowerCase() : visit.status;
    visit.date = date || visit.date;

    await visit.save();

    if (status?.toLowerCase() === "completed" && visit.adminEmail) {
      await Notification.create({
        adminEmail: visit.adminEmail,
        employeeName: visit.employeeName,
        employeeEmail: visit.employeeEmail,
        type: "task-completed",
        date: formatDate(new Date()),
        time: formatTime(new Date()),
      });
    }

    res.json({ success: true, message: "Visit updated successfully", visit });
  } catch (err) {
    console.error("Error updating visit:", err);
    res.status(500).json({ success: false, message: "Failed to update visit", error: err });
  }
});

export default router;

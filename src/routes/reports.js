import express from "express";
import multer from "multer";
import sharp from "sharp";
import Report from "../models/report.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkReportAccess } from "../middleware/checkReportPlan.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* -------------------- Helpers -------------------- */
const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const formatDate = (date) =>
  `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

const processImage = async (buffer) => {
  const MAX_SIZE = 500 * 1024; // 500 KB
  let quality = 95;
  let width = 1920;
  let height = 1080;

  let output = await sharp(buffer)
    .resize({ width, height, fit: "inside" })
    .jpeg({ quality })
    .toBuffer();

  // Reduce quality first
  while (output.length > MAX_SIZE && quality > 30) {
    quality -= 5;
    output = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  // If still too large, reduce dimensions
  while (output.length > MAX_SIZE && width > 800 && height > 600) {
    width = Math.floor(width * 0.9);
    height = Math.floor(height * 0.9);
    output = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  if (output.length > MAX_SIZE)
    throw new Error("Image too large after compression (~500 KB max)");

  return output;
};


/* -------------------- POST /report/post -------------------- */
router.post("/post", verifyToken, checkReportAccess(), upload.single("image"), async (req, res) => {
    try {
      const { clientName, purpose, notes } = req.body;
      const userEmail = req.user.email;

      if (!clientName || !purpose)
        return res
          .status(400)
          .json({ success: false, message: "Client name and purpose required" });

      const employee = await User.findOne({ email: userEmail });
      if (!employee || employee.role !== "employee") {
        return res
          .status(403)
          .json({ success: false, message: "Only employees can add reports" });
      }

      let imageBuffer = null;
      if (req.file?.buffer) imageBuffer = await processImage(req.file.buffer);

      const now = new Date();
      const formattedDate = formatDate(now);

      const report = new Report({
        clientName,
        purpose,
        notes,
        employeeName: employee.name,
        employeeEmail: employee.email,
        adminEmail: employee.adminEmail,
        date: formattedDate,
        image: imageBuffer
          ? { data: imageBuffer, contentType: "image/jpeg" }
          : undefined,
      });

      await report.save();

      if (employee.adminEmail) {
        const notification = new Notification({
          adminEmail: employee.adminEmail,
          employeeName: employee.name,
          employeeEmail: employee.email,
          type: "report-added",
          date: formattedDate,
          time: formatTime(now),
        });
        await notification.save();
      }

      const totalReports = await Report.countDocuments({
        employeeEmail: employee.email,
      });

      res.status(201).json({
        success: true,
        message: "Report added successfully",
        report,
        totalReports,
      });
    } catch (err) {
      console.error("Error creating report:", err);
      res.status(500).json({
        success: false,
        message: "Error saving report",
        error: err.message,
      });
    }
  }
);

/* -------------------- GET /report/get -------------------- */
router.get("/get", verifyToken, checkReportAccess(), async (req, res) => {
  try {
    const query =
      req.user.role === "employee" ? { employeeEmail: req.user.email } : {};
    const reports = await Report.find(query)
      .select("-image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
      totalReports: reports.length,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: err.message,
    });
  }
});

/* -------------------- GET /report/admin -------------------- */
router.get("/admin", verifyToken, checkReportAccess(), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });

    const adminEmail = req.user.email;
    const { date } = req.query;

    const filter = { adminEmail };
    if (date) filter.date = date;

    const reports = await Report.find(filter)
      .select("-image")
      .sort({ createdAt: -1 });

    const employeeCounts = await Report.aggregate([
      { $match: { adminEmail } },
      { $group: { _id: "$employeeEmail", totalReports: { $sum: 1 } } },
    ]);

    res.json({ success: true, reports, employeeCounts });
  } catch (err) {
    console.error("Error fetching admin reports:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching admin reports",
      error: err.message,
    });
  }
});

/* -------------------- GET /report/image/:id -------------------- */
router.get("/image/:id", verifyToken, checkReportAccess(), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.image?.data)
      return res.status(404).send("Image not found");

    res.set("Content-Type", report.image.contentType || "image/jpeg");
    res.send(report.image.data);
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).send("Error fetching image");
  }
});

/* -------------------- PUT /report/put/:id -------------------- */
router.put( "/put/:id", verifyToken, checkReportAccess(), upload.single("image"), async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report)
        return res
          .status(404)
          .json({ success: false, message: "Report not found" });

      if (req.user.role === "employee" && report.employeeEmail !== req.user.email)
        return res
          .status(403)
          .json({ success: false, message: "Cannot update another employee's report" });

      const { clientName, purpose, notes } = req.body;
      if (clientName) report.clientName = clientName;
      if (purpose) report.purpose = purpose;
      if (notes) report.notes = notes;
      if (req.file?.buffer)
        report.image.data = await processImage(req.file.buffer);

      await report.save();

      if (req.user.role === "employee" && report.adminEmail) {
        const now = new Date();
        const notification = new Notification({
          adminEmail: report.adminEmail,
          employeeName: req.user.name,
          employeeEmail: req.user.email,
          type: "report-updated",
          date: formatDate(now),
          time: formatTime(now),
        });
        await notification.save();
      }

      res.json({ success: true, message: "Report updated successfully", report });
    } catch (err) {
      console.error("Error updating report:", err);
      res.status(500).json({
        success: false,
        message: "Error updating report",
        error: err.message,
      });
    }
  }
);

/* -------------------- DELETE /report/delete/:id -------------------- */
router.delete( "/delete/:id",verifyToken, checkReportAccess(), async (req, res) => {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Unauthorized" });

      const report = await Report.findByIdAndDelete(req.params.id);
      if (!report)
        return res
          .status(404)
          .json({ success: false, message: "Report not found" });

      res.json({
        success: true,
        message: "Report deleted successfully",
        report,
      });
    } catch (err) {
      console.error("Error deleting report:", err);
      res.status(500).json({
        success: false,
        message: "Error deleting report",
        error: err.message,
      });
    }
  }
);

export default router;

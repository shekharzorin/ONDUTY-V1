import express from "express";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ============================================================
   🔹 DELETE /notification/clear
   → Clears ALL notifications for the logged-in admin
=============================================================== */
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    // Ensure only admins can clear notifications
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    await Notification.deleteMany({ adminEmail: email });

    res
      .status(200)
      .json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    console.error("❌ Error clearing notifications:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/* ============================================================
   🔹 GET /notification/get
   → Fetch all notifications for the logged-in admin
   🧠 Converts image Buffer → Base64 for frontend display
=============================================================== */
router.get("/get", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    // Ensure only admins can view notifications
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const notifications = await Notification.find({
      adminEmail: email,
    }).sort({ createdAt: -1 });

    // 🧠 Convert image buffer → Base64 for frontend rendering
    const formatted = notifications.map((note) => {
      const noteObj = note.toObject();

      if (noteObj.clientData?.image?.data) {
        noteObj.clientData.image = {
          data: noteObj.clientData.image.data.toString("base64"),
          contentType: noteObj.clientData.image.contentType,
        };
      }

      return noteObj;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      notifications: formatted,
    });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/* ============================================================
   🔹 DELETE /notification/:id
   → Deletes a specific notification for the logged-in admin
=============================================================== */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    // Ensure only admins can delete notifications
    const admin = await User.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      adminEmail: email,
    });

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("❌ Error deleting notification:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/* ============================================================
   🔹 OPTIONAL: GET /notification/image/:id
   → Serve notification image directly (for <Image uri>)
=============================================================== */
router.get("/image/:id", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const note = await Notification.findById(req.params.id);
    if (!note?.clientData?.image?.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", note.clientData.image.contentType);
    res.send(note.clientData.image.data);
  } catch (err) {
    console.error("❌ Error fetching notification image:", err);
    res.status(500).send("Failed to fetch image");
  }
});

export default router;

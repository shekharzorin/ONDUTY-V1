import express from "express";
import User from "../models/User.js";
import AdminTrack from "../models/Admintrack.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Helper function to format date
const formatDateTime = (date) => {
  const options = { 
    year: "numeric", month: "2-digit", day: "2-digit", 
    hour: "2-digit", minute: "2-digit", hour12: true 
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// -------------------------
// Update current user address (with token verification)
// -------------------------
router.post("/", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔹 Address update ONLY (no status)
    const track = await AdminTrack.findOneAndUpdate(
      { email: userEmail },
      {
        name: user.name,
        address,
      },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Address updated successfully",
      track: {
        ...track.toObject(),
        updatedAt: formatDateTime(track.updatedAt),
      },
    });
  } catch (err) {
    console.error("❌ Error updating address:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


router.post("/status", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { status } = req.body; // active | inactive | offline

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const track = await AdminTrack.findOneAndUpdate(
      { email: userEmail },
      { status },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Status updated successfully",
      track: {
        ...track.toObject(),
        updatedAt: formatDateTime(track.updatedAt),
      },
    });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/status", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { status } = req.body; // active | inactive | offline

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const track = await AdminTrack.findOneAndUpdate(
      { email: userEmail },
      { status },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Status updated successfully",
      track: {
        ...track.toObject(),
        updatedAt: formatDateTime(track.updatedAt),
      },
    });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// -------------------------
// Get all users tracking info
// -------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const allTracks = await AdminTrack.find({});

    // Format timestamps for each user
    const formattedTracks = allTracks.map(track => ({
      ...track.toObject(),
      updatedAt: formatDateTime(track.updatedAt),
    }));

    res.json({ success: true, allTracks: formattedTracks });
  } catch (err) {
    console.error("❌ Error fetching admin tracks:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

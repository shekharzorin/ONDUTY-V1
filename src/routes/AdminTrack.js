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
    const userEmail = req.user.email; // from token
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update or create AdminTrack record
    const track = await AdminTrack.findOneAndUpdate(
      { email: userEmail },
      {
        name: user.name,
        address,
        status: "active", // mark as active when user posts location
      },
      { new: true, upsert: true } // create if doesn't exist
    );

    // Format updatedAt before sending
    const formattedTrack = {
      ...track.toObject(),
      updatedAt: formatDateTime(track.updatedAt),
    };

    return res.json({ success: true, message: "Status updated successfully", track: formattedTrack });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    return res.status(500).json({ success: false, message: "Server error" });
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

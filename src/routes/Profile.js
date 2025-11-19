import express from "express";
import multer from "multer";
import sharp from "sharp";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ---------------- Multer setup ----------------
// (Memory storage; Sharp handles compression)
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- Helper Function ----------------
const compressImage = async (buffer) => {
  let output = await sharp(buffer)
    .resize({ width: 512, height: 512, fit: "inside" })
    .jpeg({ quality: 80 })
    .toBuffer();

  let quality = 80;
  while (output.length > 100 * 1024 && quality > 40) {
    quality -= 5;
    output = await sharp(buffer)
      .resize({ width: 512, height: 512, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  if (output.length > 100 * 1024)
    throw new Error("Image too large after compression (~100 KB max)");

  return output;
};

// ---------------- POST /profile/post ----------------
// Create or update profile using name from frontend and email from User model
router.post("/post", verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    // ✅ Only get email from user schema
    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const email = user.email;
    const { name, mobile } = req.body; // ✅ name now comes from frontend

    let imageBuffer = null;
    let imageType = null;

    if (req.file?.buffer) {
      imageBuffer = await compressImage(req.file.buffer);
      imageType = req.file.mimetype;
    }

    let profile = await Profile.findOne({ email });

    if (profile) {
      // ✅ Update existing profile
      if (name) profile.name = name;
      profile.email = email;
      if (mobile) profile.mobile = mobile;
      if (imageBuffer) {
        profile.profilePic = imageBuffer;
        profile.imageType = imageType;
      }

      await profile.save();
      return res.json({
        success: true,
        message: "Profile updated successfully",
        profile,
      });
    }

    // ✅ Create new profile
    profile = await Profile.create({
      name,
      email,
      mobile,
      profilePic: imageBuffer,
      imageType,
    });

    res.json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- GET /profile/get ----------------
// Get profile for logged-in user
router.get("/get", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const profile = await Profile.findOne({ email: user.email });
    if (!profile)
      return res.status(404).json({ success: false, message: "Profile not found" });

    // ✅ Do NOT sync name from User schema anymore

    res.json({
      success: true,
      profile: {
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        profilePicUrl: `/profile/photo/${encodeURIComponent(profile.email)}`,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- GET /profile/photo ----------------
// Fetch profile photo for logged-in user
router.get("/photo", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const profile = await Profile.findOne({ email: user.email });
    if (!profile || !profile.profilePic) return res.sendStatus(404);

    res.set("Content-Type", profile.imageType || "image/jpeg");
    res.send(profile.profilePic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// ---------------- GET /profile/photo/:email ----------------
// Admins can fetch any employee's profile photo by email
// ---------------- GET /profile/photo/:email ----------------
// Admins can fetch an employee's profile photo or info by email
router.get("/photo/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const { meta } = req.query; // 👈 query param ?meta=true
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Only admins can access others’ profile images/info
    if (user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    // ✅ If meta=true → return JSON with profile info
    if (meta === "true") {
      return res.json({
        success: true,
        profile: {
          name: profile.name,
          email: profile.email,
          mobile: profile.mobile,
          profilePicUrl: `/profile/photo/${encodeURIComponent(email)}`,
        },
      });
    }

    // ✅ Otherwise → return image directly
    if (!profile.profilePic) return res.sendStatus(404);
    res.set("Content-Type", profile.imageType || "image/jpeg");
    res.send(profile.profilePic);
  } catch (err) {
    console.error("Error fetching employee profile/photo:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});




export default router;

import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

dotenv.config();

const router = express.Router();

/* -------------------- Email Transporter -------------------- */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Email transporter error:", error);
  else console.log("✅ Email transporter ready");
});

/* ------------------------ Send OTP ------------------------ */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save({ validateBeforeSave: false });
    }

    user.otpCode = otp;
    user.otpExpires = expires;
    await user.save({ validateBeforeSave: false });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ------------------ Verify OTP ------------------ */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user || !user.otpCode || user.otpCode !== otp || Date.now() > user.otpExpires)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------- Register -------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    // ✅ Validate input
    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });

    // If user already registered (has password), block re-registration
    if (existingUser && existingUser.password) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    // If user does not exist or OTP details missing
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Please request an OTP first before registering.",
      });
    }

    // ✅ Validate OTP
    if (
      existingUser.otpCode !== otp ||
      !existingUser.otpExpires ||
      Date.now() > existingUser.otpExpires
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Complete registration
    existingUser.name = name.trim();
    existingUser.password = password;
    existingUser.role = existingUser.role || "user";
    existingUser.plan = existingUser.plan || "none";
    existingUser.isPaid = false;
    existingUser.otpCode = null;
    existingUser.otpExpires = null;

    await existingUser.save();

    // ✅ Create JWT
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

/* ---------------- Login ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ---------------- Forgot Password (Mobile Version) ---------------- */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate reset token valid for 15 minutes
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // ✅ Instead of sending email, return the token directly (for mobile app)
    res.json({
      success: true,
      message: "User found. Use this token to reset password.",
      resetToken,
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


/* ---------------- Reset Password ---------------- */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ success: false, message: "Password required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset link" });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});



// ---------------- Toggle Email Reminders ----------------
router.put("/email-reminders", verifyToken, async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid value for 'enabled'. Must be true or false.",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.emailRemindersEnabled = enabled;
    await user.save();

    res.json({
      success: true,
      message: `Email reminders have been ${enabled ? "enabled" : "disabled"}.`,
      emailRemindersEnabled: user.emailRemindersEnabled,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});


export default router;

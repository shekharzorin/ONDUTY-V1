import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";   // ✅ REQUIRED
import { verifyToken } from "../middleware/verifyToken.js";

dotenv.config();

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

/* =======================================================
   EMAIL TRANSPORTER
========================================================= */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((err) =>
  err ? console.error("❌ Email error:", err) : console.log("📨 Email is Ready in user register form")
);

/* =======================================================
   OTP STORE (IN-MEMORY)
========================================================= */
const otpStore = {}; // { email: { code: "123456", expires: Date } }

/* =======================================================
   SEND OTP
========================================================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    otpStore[email] = { code: otp, expires };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>OTP will expire in 10 minutes.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* =======================================================
   REGISTER USER
========================================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
      return res.status(400).json({ success: false, message: "All fields required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "User already exists" });

    const otpRecord = otpStore[email];
    if (!otpRecord || otpRecord.code !== otp || Date.now() > otpRecord.expires)
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    await User.create({
      name,
      email,
      password,
      role: "user",
      plan: "none",
      isPaid: false,
    });

    delete otpStore[email];
    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =======================================================
   LOGIN USER
========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // 2️⃣ Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 3️⃣ Tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await RefreshToken.create({ userId: user._id, token: refreshToken });

    // 4️⃣ Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5️⃣ Response
    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken, // optional
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* =======================================================
   FORGOT PASSWORD
========================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      success: true,
      message: "Reset token generated",
      token,
    });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* =======================================================
   RESET PASSWORD
========================================================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token)
      return res.status(400).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired link" });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});

/* =======================================================
   REFRESH TOKEN
========================================================= */
router.post("/refresh-token", async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||   // Web
      req.body?.refreshToken ||      // React Native
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const exists = await RefreshToken.findOne({
      userId: decoded.id,
      token,
    });

    if (!exists) {
      return res.status(401).json({
        success: false,
        message: "Token not recognized",
      });
    }

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});


/* =======================================================
   LOGOUT  (SAFE & IDEMPOTENT)
========================================================= */
// POST -----> /user/logout
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // 🔥 Delete refresh token from DB if exists
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // 🟢 LOG USER LOGOUT
    console.log(
      `🚪 User logged out | IP: ${req.ip} | Time: ${new Date().toISOString()}`
    );

    // 🔥 Always clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* =======================================================
   VALIDATE ACCESS TOKEN
========================================================= */
router.get("/validate", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ valid: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    res.json({ valid: true, user });
  } catch {
    res.status(401).json({ valid: false });
  }
});

/* =======================================================
   PROTECTED ADMIN ROUTE EXAMPLE
========================================================= */
router.get("/admin/data", verifyToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Access denied" });

  res.json({ success: true, message: "Admin data loaded" });
});

/* ---------------- Toggle Email Reminders ---------------- */
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

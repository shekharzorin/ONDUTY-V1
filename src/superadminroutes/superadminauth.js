import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import SuperAdmin from "../superadminmodels/SuperAdminAuth.js";
import RefreshToken from "../superadminmodels/SuperAdminRefreshToken.js";

dotenv.config();

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

/* =======================================================
   TOKEN HELPERS
========================================================= */
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.SUPERADMIN_JWT_SECRET, {
    expiresIn: "15m",
  });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.SUPERADMIN_REFRESH_SECRET, {
    expiresIn: "7d",
  });

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
  err ? console.error("❌ Email error:", err) : console.log("📨 Email is Ready in super-admin register form")
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
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    email = email.toLowerCase().trim();
    const today = new Date().toISOString().split("T")[0];

    // ❌ Prevent OTP if Super Admin already exists
    const exists = await SuperAdmin.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Super admin already exists",
      });
    }

    const record = otpStore[email];

    // 🔁 Reset count if new day
    if (record && record.date !== today) {
      delete otpStore[email];
    }

    // ❌ Limit: 2 OTPs per day
    if (record && record.count >= 2) {
      return res.status(429).json({
        success: false,
        message: "OTP request limit reached for today (2 per day)",
      });
    }

    // ⏳ Cooldown: block rapid re-requests
    if (record && Date.now() < record.expires - 9 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      code: otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      count: record ? record.count + 1 : 1,
      date: today,
    };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Super Admin OTP Verification",
      html: `
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: `OTP sent successfully (${otpStore[email].count}/2 today)`,
    });
  } catch (error) {
    console.error("❌ OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

/* =======================================================
   REGISTER (INTERNAL USE ONLY)
========================================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ❌ Already exists
    const exists = await SuperAdmin.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Super admin already exists",
      });
    }

    // ❌ OTP not found
    const otpRecord = otpStore[email];
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    // ❌ OTP expired
    if (Date.now() > otpRecord.expires) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ❌ OTP mismatch
    if (otpRecord.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ CREATE SUPER ADMIN
    await SuperAdmin.create({ name, email, password });

    // ✅ OTP is single-use
    delete otpStore[email];

    res.json({
      success: true,
      message: "Super admin registered successfully",
    });
  } catch (error) {
    console.error("❌ SuperAdmin Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =======================================================
   LOGIN
========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email }).select("+password");

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(superAdmin._id);
    const refreshToken = generateRefreshToken(superAdmin._id);

    await RefreshToken.create({
      superAdminId: superAdmin._id,
      token: refreshToken,
    });

    res.cookie("superadminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      superAdmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
      },
    });
  } catch (error) {
    console.error("❌ SuperAdmin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =======================================================
   FORGOT PASSWORD
========================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
    }

    const token = jwt.sign(
      { id: superAdmin._id },
      process.env.SUPERADMIN_JWT_SECRET,
      { expiresIn: "15m" }
    );

    superAdmin.resetPasswordToken = token;
    superAdmin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await superAdmin.save();

    // 🔐 send token via email in production
    res.json({
      success: true,
      message: "Super admin found. Proceed to reset password",
      validFor: "15 minutes",
      token,
    });
  } catch (error) {
    console.error("❌ SuperAdmin Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =======================================================
   RESET PASSWORD
========================================================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SUPERADMIN_JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Reset session has expired"
,
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid reset session",
      });
    }

    const superAdmin = await SuperAdmin.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: "Reset session expired or already used",
      });
    }

    superAdmin.password = password;
    superAdmin.resetPasswordToken = null;
    superAdmin.resetPasswordExpires = null;
    await superAdmin.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("❌ SuperAdmin Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =======================================================
   REFRESH TOKEN (COOKIE ONLY)
========================================================= */
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies?.superadminRefreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.SUPERADMIN_REFRESH_SECRET
    );

    const exists = await RefreshToken.findOne({
      superAdminId: decoded.id,
      token: refreshToken,
    });

    if (!exists) {
      return res.status(401).json({
        success: false,
        message: "Token not recognized",
      });
    }

    const accessToken = generateAccessToken(decoded.id);

    res.json({ success: true, accessToken });
  } catch (error) {
    console.error("❌ SuperAdmin Refresh Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
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

    const decoded = jwt.verify(token, process.env.SUPERADMIN_JWT_SECRET);
    const superAdmin = await SuperAdmin.findById(decoded.id);

    if (!superAdmin) return res.status(401).json({ valid: false });

    res.json({
      valid: true,
      superAdmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
      },
    });
  } catch {
    res.status(401).json({ valid: false });
  }
});

/* =======================================================
   LOGOUT
========================================================= */
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.superadminRefreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("superadminRefreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ SuperAdmin Logout Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

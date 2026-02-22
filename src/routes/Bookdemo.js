import express from "express";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

transporter.verify((err) =>
  err
    ? console.error("❌ Email error:", err)
    : console.log("📨 Email is Ready in Book-Demo"),
);

// POST /bookdemo/request
router.post("/request", async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    // ✅ Only required-field check
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await transporter.sendMail({
      from: `"OnDuty" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // company inbox
      subject: "New Demo Request",
      html: `
        <h2>New Demo Request</h2>
        <h3><b>Name:</b> ${name}</h3>
        <h3><b>Email:</b> ${email}</h3>
        <h3><b>Mobile:</b> ${mobile}</h3>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return res.json({
      success: true,
      message: "Demo request sent successfully",
    });
  } catch (error) {
    console.error("❌ Mail error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send demo request",
    });
  }
});

export default router;

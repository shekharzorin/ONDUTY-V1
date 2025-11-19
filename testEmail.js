import dotenv from "dotenv";
import { sendEmail } from "./src/utils/mailer.js";

dotenv.config(); // load .env variables

(async () => {
  try {
    const recipient = "noumansohail40@gmail.com"; // replace with your email
    await sendEmail(recipient, "Test Email", "This is a test email from Onduty backend.");
    console.log("✅ Email test successful!");
  } catch (err) {
    console.error("❌ Email test failed:", err);
  }
})();

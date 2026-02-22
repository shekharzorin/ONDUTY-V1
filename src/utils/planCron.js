import cron from "node-cron";
import User from "../models/User.js";
import { sendEmail } from "./mailer.js";

// Daily at 8 AM UTC
cron.schedule("0 8 * * *", async () => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    // Reminder emails
    const usersToRemind = await User.find({
      planExpiry: { $gte: today, $lte: twoDaysLater },
      emailReminderSent: false,
      emailRemindersEnabled: true,
    });

    for (const user of usersToRemind) {
      try {
        await sendEmail(
          user.email,
          "Plan Expiring Soon",
          `Hello ${user.name}, your ${user.plan} plan expires on ${user.planExpiry.toDateString()}.`
        );
        user.emailReminderSent = true;
        await user.save();
      } catch (err) {}
    }

    // Downgrade expired admins
    const expiredAdmins = await User.find({
      role: "admin",
      planExpiry: { $lt: today },
    });

    for (const user of expiredAdmins) {
      const previousPlan = user.plan;

      user.role = "user";
      user.plan = "none";
      user.isPaid = false;
      user.emailReminderSent = false;
      await user.save();

      if (user.emailRemindersEnabled) {
        try {
          await sendEmail(
            user.email,
            "Plan Expired",
            `Hello ${user.name}, your ${previousPlan} plan expired and admin rights have been removed.`
          );
        } catch (err) {}
      }
    }

  } catch (err) {
    console.error("Cron error:", err);
  }
});

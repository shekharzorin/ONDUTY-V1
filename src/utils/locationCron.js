import AdminTrack from "../models/Admintrack.js";

setInterval(async () => {
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago UTC

    console.log("Checking users inactive before:", twoHoursAgo.toISOString());

    const result = await AdminTrack.updateMany(
      { updatedAt: { $lt: twoHoursAgo }, status: "active" },
      { $set: { status: "inactive" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`🟡 Updated ${result.modifiedCount} users to inactive`);
    }
  } catch (err) {
    console.error("❌ Error updating inactive users:", err);
  }
}, 60 * 1000); // every 1 minute

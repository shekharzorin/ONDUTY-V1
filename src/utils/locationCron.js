import AdminTrack from "../models/Admintrack.js";

setInterval(async () => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

    console.log("Checking users inactive before:", fiveMinutesAgo.toISOString());

    const result = await AdminTrack.updateMany(
      { updatedAt: { $lt: fiveMinutesAgo }, status: "active" },
      { $set: { status: "inactive" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`🟡 Updated ${result.modifiedCount} users to inactive`);
    }
  } catch (err) {
    console.error("❌ Error updating inactive users:", err);
  }
}, 60 * 1000); // runs every 1 minute

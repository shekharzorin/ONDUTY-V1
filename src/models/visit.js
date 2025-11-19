import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    adminEmail: { type: String, required: true },

    taskName: { type: String, required: true },
    type: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: "pending" }, // pending | completed, etc.
    date: { type: String, required: true },       // e.g. "24/10/2025"

    image: { type: Buffer },                      // Optional image binary
    imageType: { type: String },                  // MIME type
  },
  { timestamps: true }
);

// 🧹 Auto-delete after 30 days (TTL Index)
visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model("Visit", visitSchema);

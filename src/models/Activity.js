import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    // 🧑 Employee Info
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    adminEmail: { type: String, required: true },

    // 🧭 Activity Type
    type: {
      type: String,
      enum: ["clock-in", "clock-out", "client-check-in", "client-check-out"],
      required: true,
    },

    // 🕒 Work Timings
    clockInTime: { type: String },
    clockOutTime: { type: String },
    workedHours: { type: String },

    // 🧑‍💼 Client Activity
    clientName: { type: String },
    clientCheckInTime: { type: String },
    clientCheckOutTime: { type: String },

    // 📍 Location Info
    fromLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    toLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // 📅 Readable date for easy grouping (e.g. "27/10/2025")
    dateString: { type: String, required: true },

    // 🕒 Readable time (e.g. "08:45 PM")
    timeString: { type: String, required: true },

    // ⚙️ Employee Status
    status: {
      type: String,
      enum: ["Active", "Inactive"]
    },
  },
  { timestamps: true }
);

// 🧹 Auto-delete after 30 days
ActivitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

export default mongoose.model("Activity", ActivitySchema);

import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  purpose: { type: String, required: true },
  notes: { type: String },

  // 🧑 Employee/Admin info
  employeeName: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  adminEmail: { type: String, required: true },

  // 🗓 Report date (DD/MM/YYYY)
  date: { type: String, required: true },

  // 🖼 Store image directly (Buffer)
  image: {
    data: Buffer,
    contentType: String,
  },

  createdAt: { type: Date, default: Date.now },
});

// 🧹 Auto-delete documents after 30 days (TTL)
ReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Report = mongoose.model("Report", ReportSchema);

export default Report;

import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    adminEmail: { type: String, required: true }, // Which admin this belongs to
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "clock-in",
        "clock-out",
        "client-check-in",
        "client-check-out",
        "task-added",
        "task-completed",
        "report-added",
        "report-updated",
        "client-pending", // Employee added client → admin approval pending
        "client-approved", // Admin approved client
        "client-declined", // Admin declined client
      ],
      required: true,
    },
    date: { type: String, required: true }, // e.g. "24/10/2025"
    time: { type: String, required: true }, // e.g. "03:25 PM"

    // Optional field to store client data for pending approval
    clientData: {
      name: { type: String },
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      clientNumber: { type: String },
      image: { data: Buffer, contentType: String },
      employeeEmail: { type: String },
    },

    // TTL field – MongoDB auto-deletes after 7 days
    createdAt: { type: Date, default: Date.now, expires: 604800 },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);

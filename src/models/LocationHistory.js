import mongoose from "mongoose";

const LocationHistorySchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    adminEmail: { type: String, required: true },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Optional: if you want to clean up history older than 15 days
LocationHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds:  7* 24 * 60 * 60 });

const LocationHistory = mongoose.model("LocationHistory", LocationHistorySchema);
export default LocationHistory;

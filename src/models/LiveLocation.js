import mongoose from "mongoose";

const LiveLocationSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true, unique: true }, // one per employee
    adminEmail: { type: String, required: true },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LiveLocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

const LiveLocation = mongoose.model("LiveLocation", LiveLocationSchema);
export default LiveLocation;

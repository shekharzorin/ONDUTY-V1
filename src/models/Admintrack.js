import mongoose from "mongoose";

const adminTrackSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, default: "Unknown" },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("AdminTrack", adminTrackSchema);

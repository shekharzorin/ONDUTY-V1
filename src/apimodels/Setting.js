import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    key_name: {
      type: String,
      required: true,
      unique: true,
    },
    value: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
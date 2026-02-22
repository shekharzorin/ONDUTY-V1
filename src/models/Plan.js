// models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      enum: ["trial", "silver", "gold", "diamond"],
      required: true,
      unique: true,
    },

    price: {
      monthly: {
        type: Number,
        required: true,
        min: 0,
      },
      yearly: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);

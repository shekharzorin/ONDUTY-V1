import mongoose from "mongoose";

const superAdminRefreshTokenSchema = new mongoose.Schema(
  {
    superAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expires: 0, // ✅ TTL index (MongoDB auto deletes)
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SuperAdminRefreshToken",
  superAdminRefreshTokenSchema
);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ========================
// User Schema (Merged)
// ========================
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Role and Relations
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },
    adminEmail: { type: String }, // link employee to admin

    // Plan Info
    plan: {
      type: String,
      enum: ["trial", "silver", "gold", "diamond", "none"],
      default: "none",
    },
    planType: { type: String, enum: ["monthly", "yearly"] },
    planStart: { type: Date },
    planExpiry: { type: Date },
    isPaid: { type: Boolean, default: false },
    emailReminderSent: { type: Boolean, default: false },
    emailRemindersEnabled: { type: Boolean, default: true },

    
    hasUsedFreePlan: { type: Boolean, default: false },
    
    // OTP + Password Reset
    otpCode: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// ========================
// Password Hash Middleware
// ========================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ========================
// Compare Password Method
// ========================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ========================
// Plan Feature Map
// ========================
export const planFeatures = {
  trial: {
    visit: true,
    report: true,
    client: true,
    liveLocation: true,
    addEmployees: true,
    adminViewAll: true,
    employeeIsolation: true,
    employeeTrackingHistory: true, // ✅ enabled for trial
  },
  silver: {
    visit: true,
    report: true,
    client: false,
    liveLocation: false,
    addEmployees: true,
    adminViewAll: true,
    employeeIsolation: true,
    employeeTrackingHistory: false, // ❌ disabled
  },
  gold: {
    visit: true,
    report: true,
    client: false,
    liveLocation: true,
    addEmployees: true,
    adminViewAll: true,
    employeeIsolation: true,
    employeeTrackingHistory: true, // ✅ enabled for gold
  },
  diamond: {
    visit: true,
    report: true,
    client: true,
    liveLocation: true,
    addEmployees: true,
    adminViewAll: true,
    employeeIsolation: true,
    employeeTrackingHistory: true, // ✅ enabled for diamond
  },
};

export default mongoose.model("User", userSchema);

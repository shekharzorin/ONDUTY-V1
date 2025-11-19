import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      default: "",
      trim: true,
    },
    profilePic: {
      type: Buffer, // binary image data
    },
    imageType: {
      type: String, // MIME type (e.g., "image/jpeg")
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;

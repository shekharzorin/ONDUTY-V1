import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    // ✅ Basic Info
    name: { type: String, required: true },
    address: { type: String, required: true },
    clientNumber: { type: String, required: true }, // Client contact number

    // ✅ Coordinates
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    // ✅ Admin linkage
    adminEmail: { type: String, required: true }, // Which admin this client belongs to

    // ✅ Image Storage
    image: { type: Buffer },        // Binary image data
    imageType: { type: String },    // MIME type (e.g., "image/jpeg")
  },
  { timestamps: true }              // Adds createdAt, updatedAt
);

const Client = mongoose.model("Client", clientSchema);
export default Client;

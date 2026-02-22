import express from "express";
import multer from "multer";
import sharp from "sharp";
import Client from "../models/client.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkClientAccess } from "../middleware/checkClientPlan.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- Helper functions ----------------
const processImage = async (buffer) => {
  const MAX_SIZE = 500 * 1024; // 500 KB
  let quality = 95;
  let width = 1920;
  let height = 1080;

  let output = await sharp(buffer)
    .resize({ width, height, fit: "inside" })
    .jpeg({ quality })
    .toBuffer();

  // Reduce quality first
  while (output.length > MAX_SIZE && quality > 30) {
    quality -= 5;
    output = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  // If still too large, reduce dimensions
  while (output.length > MAX_SIZE && width > 800 && height > 600) {
    width = Math.floor(width * 0.9);
    height = Math.floor(height * 0.9);
    output = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .jpeg({ quality })
      .toBuffer();
  }

  if (output.length > MAX_SIZE)
    throw new Error("Image too large after compression (~500 KB max)");

  return output;
};



const formatDate = (date) =>
  `${date.getDate().toString().padStart(2, "0")}/${
    (date.getMonth() + 1).toString().padStart(2, "0")
  }/${date.getFullYear()}`;

const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// ---------------- POST /client/post ----------------
// Employee adds a client (pending admin approval)
router.post(
  "/post",
  verifyToken,
  checkClientAccess(),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, address, latitude, longitude, clientNumber } = req.body;

      // 🧩 Validate request body
      if (!name || !address || !latitude || !longitude || !clientNumber) {
        return res
          .status(400)
          .json({ success: false, message: "All client fields are required" });
      }

      // 🧩 Find the logged-in user
      const user = await User.findOne({ email: req.user.email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      // 🧩 Common image processing (optional)
      let imageBuffer = null;
      if (req.file?.buffer) {
        imageBuffer = await processImage(req.file.buffer);
      }

      // =====================================================================
      // 🔹 CASE 1: ADMIN directly adds a client
      // =====================================================================
      if (user.role === "admin") {
        const newClient = new Client({
          name,
          address,
          latitude,
          longitude,
          clientNumber,
          adminEmail: user.email,
          addedBy: "admin",
          image: imageBuffer || undefined, // 🧩 Only store raw Buffer
          imageType: req.file?.mimetype || undefined, // 🧩 Store MIME type separately
        });

        await newClient.save();

        return res.status(201).json({
          success: true,
          message: "Client added successfully by admin",
          client: newClient,
        });
      }

      // =====================================================================
      // 🔹 CASE 2: EMPLOYEE linked to an admin adds a client (goes for approval)
      // =====================================================================
      if (user.role === "employee") {
        if (!user.adminEmail)
          return res.status(400).json({
            success: false,
            message: "Employee has no linked admin",
          });

        const notification = new Notification({
          adminEmail: user.adminEmail,
          employeeName: user.name,
          employeeEmail: user.email,
          type: "client-pending",
          date: formatDate(new Date()),
          time: formatTime(new Date()),
          clientData: {
            name,
            address,
            latitude,
            longitude,
            clientNumber,
            image: imageBuffer
              ? { data: imageBuffer, contentType: "image/jpeg/png" }
              : undefined,
          },
        });

        await notification.save();

        return res.status(200).json({
          success: true,
          message: "Client request sent to admin for approval",
        });
      }

      // =====================================================================
      // 🔹 CASE 3: Other roles (like superadmin, etc.) — not allowed
      // =====================================================================
      return res.status(403).json({
        success: false,
        message: "Only admins or linked employees can add clients",
      });
    } catch (err) {
      console.error("❌ Error adding client:", err);
      res.status(500).json({
        success: false,
        message: "Failed to add client",
        error: err.message,
      });
    }
  }
);


// ---------------- GET /client/get ----------------
// Employee gets all clients under their admin
router.get("/get", verifyToken, checkClientAccess(), async (req, res) => {
  try {
    const employee = await User.findOne({ email: req.user.email });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const clients = await Client.find({
      adminEmail: employee.adminEmail,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      clients,
      totalClients: clients.length,
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: err.message,
    });
  }
});

// ---------------- PUT /client/put/:id ----------------
// Employee updates a client
router.put(
  "/put/:id",
  verifyToken,
  checkClientAccess(),
  upload.single("image"),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client)
        return res
          .status(404)
          .json({ success: false, message: "Client not found" });

      const user = await User.findOne({ email: req.user.email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const { name, address, latitude, longitude, clientNumber } = req.body;

      // 🧩 Common image processing (if provided)
      let imageBuffer = null;
      if (req.file?.buffer) {
        imageBuffer = await processImage(req.file.buffer);
      }

      // =====================================================================
      // 🔹 CASE 1: ADMIN updates client directly
      // =====================================================================
      if (user.role === "admin") {
        // ✅ Update fields if provided
        if (name) client.name = name;
        if (address) client.address = address;
        if (latitude) client.latitude = latitude;
        if (longitude) client.longitude = longitude;
        if (clientNumber) client.clientNumber = clientNumber;

        if (imageBuffer) {
          client.image = imageBuffer; // 🧩 Raw buffer only
          client.imageType = req.file?.mimetype || "image/jpeg";
        }

        await client.save();

        return res.status(200).json({
          success: true,
          message: "Client updated successfully by admin",
          client,
        });
      }

      // =====================================================================
      // 🔹 CASE 2: EMPLOYEE linked to admin — sends update request
      // =====================================================================
      if (user.role === "employee") {
        if (!user.adminEmail)
          return res.status(400).json({
            success: false,
            message: "Employee has no linked admin",
          });

        // ✅ Ensure the employee belongs to the same admin
        if (client.adminEmail !== user.adminEmail)
          return res.status(403).json({
            success: false,
            message: "Unauthorized: You can only update your admin’s clients",
          });

        // 🧩 Directly update client (no notification)
        if (name) client.name = name;
        if (address) client.address = address;
        if (latitude) client.latitude = latitude;
        if (longitude) client.longitude = longitude;
        if (clientNumber) client.clientNumber = clientNumber;

        if (imageBuffer) {
          client.image = imageBuffer;
          client.imageType = req.file?.mimetype || "image/jpeg";
        }

        await client.save();

        return res.status(200).json({
          success: true,
          message: "Client updated successfully by employee",
          client,
        });
      }

      // =====================================================================
      // 🔹 CASE 3: Other roles — not allowed
      // =====================================================================
      return res.status(403).json({
        success: false,
        message: "Only admins or linked employees can update clients",
      });
    } catch (err) {
      console.error("❌ Error updating client:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update client",
        error: err.message,
      });
    }
  }
);

// ---------------- GET /client/admin ----------------
// Admin gets all their clients (from login token)
router.get("/admin", verifyToken, checkClientAccess(), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const clients = await Client.find({
      adminEmail: req.user.email,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      clients,
      totalClients: clients.length,
    });
  } catch (err) {
    console.error("Error fetching admin clients:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: err.message,
    });
  }
});

// ---------------- DELETE /client/delete/:id ----------------
router.delete("/delete/:id", verifyToken, checkClientAccess(), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });

    res.json({
      success: true,
      message: "Client deleted successfully",
      client,
    });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: err.message,
    });
  }
});

// ---------------- PUT /client/approve/:notificationId ----------------
router.put("/approve/:notificationId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Unauthorized" });

    const { approved } = req.body;
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    if (approved) {
      const data = notification.clientData;

      const client = new Client({
        name: data.name,
        address: data.address,
        clientNumber: data.clientNumber,
        latitude: data.latitude,
        longitude: data.longitude,
        adminEmail: req.user.email, // ✅ from token
        image: data.image?.data,
        imageType: data.image?.contentType,
      });

      await client.save();
    }

    await Notification.findByIdAndDelete(req.params.notificationId);

    res.json({
      success: true,
      message: approved
        ? "Client approved and added"
        : "Client request declined",
    });
  } catch (err) {
    console.error("Error approving client:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process approval",
      error: err.message,
    });
  }
});

// ---------------- GET /client/image/:id ----------------
router.get("/image/:id", verifyToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || !client.image) return res.status(404).send("Image not found");

    res.set("Content-Type", client.imageType);
    res.send(client.image);
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).send("Failed to fetch image");
  }
});

export default router;
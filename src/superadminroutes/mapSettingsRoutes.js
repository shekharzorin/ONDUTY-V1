import express from "express";
import Setting from "../apimodels/Setting.js";
import verifySuperAdmin from "../superadminmiddleware/verifySuperAdmin.js";

const router = express.Router();

/**
 * ==========================================
 *   MAP SETTINGS (SUPER ADMIN ONLY)
 * ==========================================
 *
 * Supported keys:
 * - android_map_key
 * - ios_map_key
 * - web_map_key
 * - map_enabled
 */


/* =====================================================
   1️⃣ ADD / UPDATE MAP KEY (ANDROID / IOS / WEB / ENABLE)
===================================================== */
router.post("/map-api", verifySuperAdmin, async (req, res) => {
  try {
    const { androidKey, iosKey, webKey, mapEnabled } = req.body;

    const updates = [];

    if (androidKey) {
      updates.push(
        Setting.findOneAndUpdate(
          { key_name: "android_map_key" },
          { value: androidKey, status: true },
          { upsert: true }
        )
      );
    }

    if (iosKey) {
      updates.push(
        Setting.findOneAndUpdate(
          { key_name: "ios_map_key" },
          { value: iosKey, status: true },
          { upsert: true }
        )
      );
    }

    if (webKey) {
      updates.push(
        Setting.findOneAndUpdate(
          { key_name: "web_map_key" },
          { value: webKey, status: true },
          { upsert: true }
        )
      );
    }

    if (mapEnabled !== undefined) {
      updates.push(
        Setting.findOneAndUpdate(
          { key_name: "map_enabled" },
          { value: mapEnabled ? "true" : "false" },
          { upsert: true }
        )
      );
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one value to update",
      });
    }

    await Promise.all(updates);

    res.json({
      success: true,
      message: "Map configuration updated successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update map config",
      error: err.message,
    });
  }
});


/* =====================================================
   2️⃣ GET ALL MAP SETTINGS
===================================================== */
router.get("/map-api", verifySuperAdmin, async (req, res) => {
  try {
    const settings = await Setting.find({
      key_name: {
        $in: [
          "android_map_key",
          "ios_map_key",
          "web_map_key",
          "map_enabled",
        ],
      },
    });

    const config = {
      androidMapKey: null,
      iosMapKey: null,
      webMapKey: null,
      mapEnabled: false,
    };

    settings.forEach((s) => {
      if (s.key_name === "android_map_key") config.androidMapKey = s.value;
      if (s.key_name === "ios_map_key") config.iosMapKey = s.value;
      if (s.key_name === "web_map_key") config.webMapKey = s.value;
      if (s.key_name === "map_enabled")
        config.mapEnabled = s.value === "true";
    });

    res.json({
      success: true,
      data: config,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch map settings",
    });
  }
});


/* =====================================================
   3️⃣ DELETE SINGLE MAP KEY
===================================================== */
/*
Example:
DELETE /map-api/android_map_key
DELETE /map-api/ios_map_key
DELETE /map-api/web_map_key
DELETE /map-api/map_enabled
*/
router.delete("/map-api/:key", verifySuperAdmin, async (req, res) => {
  try {
    const allowedKeys = [
      "android_map_key",
      "ios_map_key",
      "web_map_key",
      "map_enabled",
    ];

    if (!allowedKeys.includes(req.params.key)) {
      return res.status(400).json({
        success: false,
        message: "Invalid key",
      });
    }

    const deleted = await Setting.findOneAndDelete({
      key_name: req.params.key,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.json({
      success: true,
      message: `${req.params.key} deleted successfully`,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete setting",
    });
  }
});

export default router;
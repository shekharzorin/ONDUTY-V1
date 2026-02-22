import express from "express";
import Setting from "../apimodels/Setting.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * ==========================================
 *   SYSTEM CONFIG (ADMIN + EMPLOYEE)
 * ==========================================
 */

router.get("/map-config", verifyToken, async (req, res) => {
  try {
    const settings = await Setting.find({
      key_name: {
        $in: ["android_map_key", "ios_map_key", "web_map_key", "map_enabled"],
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
      if (s.key_name === "map_enabled") config.mapEnabled = s.value === "true";
    });

    res.json({
      success: true,
      config,
    });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;

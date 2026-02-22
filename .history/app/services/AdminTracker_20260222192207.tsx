import { getMapConfig, postAdminAddress } from "@/app/backend-api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

class AdminLocationTracker {
  private static instance: AdminLocationTracker;

  // 🔒 SESSION LOCKS
  private hasRunThisSession = false;
  private isPosting = false;

  private constructor() {}

  /* ----------------------------------------
     SINGLETON INSTANCE
  ---------------------------------------- */
  public static getInstance(): AdminLocationTracker {
    if (!AdminLocationTracker.instance) {
      AdminLocationTracker.instance = new AdminLocationTracker();
    }
    return AdminLocationTracker.instance;
  }

  /* ----------------------------------------
     STOP TRACKING (LOGOUT SAFE)
  ---------------------------------------- */
  public stopTracking() {
    console.log("🛑 AdminLocationTracker stopped");
    this.hasRunThisSession = false;
    this.isPosting = false;
  }

  /* ----------------------------------------
     START TRACKING (CALL ON APP OPEN)
  ---------------------------------------- */
  public async startTracking() {
    // 🛑 HARD STOP: already done in this app session
    if (this.hasRunThisSession || this.isPosting) {
      return;
    }

    try {
      // ✅ CHECK MAP ENABLED
      const config = await getMapConfig();
      if (!config.success || !config.mapEnabled) {
        console.log("🛑 Admin tracking disabled by super admin");
        return;
      }

      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== "admin") return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("⚠️ Location permission denied");
        return;
      }

      this.isPosting = true;
      console.log("📍 Fetching admin location (app open)");

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const addrArray = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let formattedAddress = "Unknown";

      if (addrArray.length > 0) {
        const addr = addrArray[0];
        formattedAddress = [
          addr.name,
          addr.street,
          addr.district || addr.subregion,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");
      }

      console.log("📤 Posting admin address:", formattedAddress);
      await postAdminAddress(formattedAddress);

      console.log("✅ Admin location posted on app open");

      // 🔐 Lock for this app session
      this.hasRunThisSession = true;
    } catch (err) {
      console.error("❌ AdminLocationTracker error:", err);
    } finally {
      this.isPosting = false;
    }
  }
}

/* ----------------------------------------
   EXPORT SINGLETON INSTANCE
---------------------------------------- */
export default AdminLocationTracker.getInstance();

import { getMapConfig, postAdminAddress } from "@/app/backend-api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

class AdminLocationTracker {
  private static instance: AdminLocationTracker;

  // 🔒 SESSION LOCKS
  private hasRunThisSession = false;
  private isPosting = false;

  // ✅ cache map config (prevent API spam)
  private mapEnabledCache: boolean | null = null;
  private lastConfigCheck = 0;

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

    // reset cache
    this.mapEnabledCache = null;
    this.lastConfigCheck = 0;
  }

  /* ----------------------------------------
     START TRACKING (CALL ON APP OPEN)
  ---------------------------------------- */
  public async startTracking() {
    // 🛑 HARD STOP: already done in this app session
    if (this.hasRunThisSession || this.isPosting) return;

    try {
      /* ----------------------------------------
         CHECK MAP ENABLED (CACHE 5 MIN)
      ---------------------------------------- */
      const now = Date.now();

      if (
        this.mapEnabledCache === null ||
        now - this.lastConfigCheck > 5 * 60 * 1000
      ) {
        const config = await getMapConfig();

        if (!config.success) {
          console.log("⚠️ Cannot fetch map config");
          return;
        }

        this.mapEnabledCache = config.mapEnabled;
        this.lastConfigCheck = now;
      }

      if (!this.mapEnabledCache) {
        console.log("🛑 Admin tracking disabled by super admin");
        return;
      }

      /* ----------------------------------------
         CHECK USER ROLE
      ---------------------------------------- */
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== "admin") return;

      /* ----------------------------------------
         LOCATION PERMISSION
      ---------------------------------------- */
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("⚠️ Location permission denied");
        return;
      }

      this.isPosting = true;
      console.log("📍 Fetching admin location (app open)");

      /* ----------------------------------------
         GET CURRENT LOCATION (SAFE)
      ---------------------------------------- */
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      }).catch(() => null);

      if (!loc?.coords) {
        console.log("⚠️ Could not get location");
        return;
      }

      /* ----------------------------------------
         REVERSE GEOCODE ADDRESS
      ---------------------------------------- */
      let formattedAddress = "Unknown";

      try {
        const addrArray = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

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
      } catch (err) {
        console.log("⚠️ Reverse geocode failed:", err);
      }

      /* ----------------------------------------
         POST ADDRESS TO BACKEND
      ---------------------------------------- */
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

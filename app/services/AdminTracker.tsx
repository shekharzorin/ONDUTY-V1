import { postAdminAddress } from "@/app/backend-api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

type Coordinates = { latitude: number; longitude: number };

class AdminLocationTracker {
  private static instance: AdminLocationTracker;
  private interval: ReturnType<typeof setInterval> | null = null;
  private isPosting = false;

  private constructor() {}

  public static getInstance(): AdminLocationTracker {
    if (!AdminLocationTracker.instance) {
      AdminLocationTracker.instance = new AdminLocationTracker();
    }
    return AdminLocationTracker.instance;
  }

  public async startTracking() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("⚠️ Location permission denied");
        return;
      }

      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      if (user.role !== "admin") return;

      // 🕐 Run every 30 seconds only
      if (!this.interval) {
        this.interval = setInterval(async () => {
          if (this.isPosting) return;

          try {
            this.isPosting = true;
            console.log("📍 Fetching current admin location...");

            // ✅ Get latest location once per interval
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });

            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };

            // ✅ Get address for current coordinates
            const addrArray = await Location.reverseGeocodeAsync(coords);
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
            console.log("✅ Address posted successfully");
          } catch (err) {
            console.error("❌ Error posting admin address:", err);
          } finally {
            this.isPosting = false;
          }
        }, 30000); // every 30 seconds
      }
    } catch (err) {
      console.error("❌ Error in AdminLocationTracker:", err);
    }
  }

  public stopTracking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default AdminLocationTracker.getInstance();

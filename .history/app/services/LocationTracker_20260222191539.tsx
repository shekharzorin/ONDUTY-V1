// services/LocationTracker.ts
import { getMapConfig, postLiveLocation } from "@/app/backend-api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

type Coordinates = { latitude: number; longitude: number };

class LocationTracker {
  private static instance: LocationTracker;
  private watcher: Location.LocationSubscription | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private latestLocation: Coordinates | null = null;
  private latestAddress: string = "Fetching location...";
  private subscribers: ((coords: Coordinates, address: string) => void)[] = [];
  private isPosting = false;
  private lastGeocodeTime = 0;

  private constructor() {}

  public static getInstance(): LocationTracker {
    if (!LocationTracker.instance) {
      LocationTracker.instance = new LocationTracker();
    }
    return LocationTracker.instance;
  }

  public async startTracking() {
    try {
      // ✅ CHECK MAP ENABLED
      const config = await getMapConfig();
      if (!config.success || !config.mapEnabled) {
        console.log("🛑 Location tracking disabled by admin");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      if (!this.watcher) {
        this.watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 2,
          },
          async (loc) => {
            if (!loc?.coords) return;

            const coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            this.latestLocation = coords;

            const now = Date.now();
            if (now - this.lastGeocodeTime > 8000) {
              this.lastGeocodeTime = now;
              try {
                const addrArray = await Location.reverseGeocodeAsync(coords);
                if (addrArray.length > 0) {
                  const a = addrArray[0];
                  this.latestAddress = [
                    a.name,
                    a.street,
                    a.subregion,
                    a.city,
                    a.postalCode,
                    a.region,
                  ]
                    .filter(Boolean)
                    .join(", ");
                }
              } catch (e) {
                console.log("⚠️ Geocode error:", e);
              }
            }

            this.subscribers.forEach((cb) => cb(coords, this.latestAddress));
          },
        );
      }

      if (!this.interval) {
        this.interval = setInterval(async () => {
          if (!this.latestLocation || this.isPosting) return;

          try {
            const userData = await AsyncStorage.getItem("user");
            if (!userData) return;

            const user = JSON.parse(userData);
            if (user.role !== "employee") return;

            this.isPosting = true;
            await postLiveLocation(
              this.latestLocation.latitude,
              this.latestLocation.longitude,
            );

            console.log("📨 Employee Location Post to Backend");
          } catch (err) {
            console.log("⚠️ Error posting location:", err);
          } finally {
            this.isPosting = false;
          }
        }, 30000);
      }
    } catch (err) {
      console.log("❌ LocationTracker Error:", err);
    }
  }

  /** Stop tracking completely */
  public stopTracking() {
    // Stop the location watcher
    if (this.watcher) {
      this.watcher.remove();
      this.watcher = null;
    }

    // Stop interval posting
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Reset state
    this.latestLocation = null;
    this.latestAddress = "Fetching location...";
    console.log("🛑 Location tracking stopped");
  }

  public subscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers.push(callback);
    if (this.latestLocation) callback(this.latestLocation, this.latestAddress);
  }

  public unsubscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
}

export default LocationTracker.getInstance();

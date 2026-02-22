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
  private isStarted = false; // ✅ prevent multiple start calls
  private lastGeocodeTime = 0;

  // ✅ cache map config (prevent API spam)
  private mapEnabledCache: boolean | null = null;
  private lastConfigCheck = 0;

  private constructor() {}

  public static getInstance(): LocationTracker {
    if (!LocationTracker.instance) {
      LocationTracker.instance = new LocationTracker();
    }
    return LocationTracker.instance;
  }

  /* =========================================================
     START TRACKING
  ========================================================= */
  public async startTracking() {
    try {
      // ✅ prevent duplicate start
      if (this.isStarted) return;

      /* ----------------------------
         CHECK MAP ENABLED (CACHE 5 MIN)
      ---------------------------- */
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
        console.log("🛑 Location tracking disabled by admin");
        return;
      }

      /* ----------------------------
         LOCATION PERMISSION
      ---------------------------- */
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }

      /* ----------------------------
         START LOCATION WATCHER
      ---------------------------- */
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

            /* ----------------------------
               REVERSE GEOCODE (8 sec throttle)
            ---------------------------- */
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

            // notify subscribers
            this.subscribers.forEach((cb) => cb(coords, this.latestAddress));
          },
        );
      }

      /* ----------------------------
         POST LOCATION TO BACKEND EVERY 30s
      ---------------------------- */
      if (!this.interval) {
        this.interval = setInterval(async () => {
          if (!this.latestLocation || this.isPosting) return;

          try {
            const userData = await AsyncStorage.getItem("user");
            if (!userData) return;

            const user = JSON.parse(userData);

            // only employee posts location
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

      this.isStarted = true;
      console.log("✅ Location tracking started");
    } catch (err) {
      console.log("❌ LocationTracker Error:", err);
    }
  }

  /* =========================================================
     STOP TRACKING COMPLETELY
  ========================================================= */
  public stopTracking() {
    // stop watcher
    if (this.watcher) {
      this.watcher.remove();
      this.watcher = null;
    }

    // stop interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // reset state
    this.latestLocation = null;
    this.latestAddress = "Fetching location...";
    this.subscribers = []; // ✅ clear memory
    this.isStarted = false;

    console.log("🛑 Location tracking stopped");
  }

  /* =========================================================
     SUBSCRIBE LOCATION UPDATES
  ========================================================= */
  public subscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers.push(callback);

    if (this.latestLocation) {
      callback(this.latestLocation, this.latestAddress);
    }
  }

  /* =========================================================
     UNSUBSCRIBE
  ========================================================= */
  public unsubscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
}

export default LocationTracker.getInstance();

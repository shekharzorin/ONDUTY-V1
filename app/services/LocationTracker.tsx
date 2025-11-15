// services/LocationTracker.ts
import { postLiveLocation } from "@/app/backend-api/api";
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

  private constructor() {}

  public static getInstance(): LocationTracker {
    if (!LocationTracker.instance) {
      LocationTracker.instance = new LocationTracker();
    }
    return LocationTracker.instance;
  }

  public async startTracking() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return alert("Permission denied");

    if (!this.watcher) {
      this.watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 },
        async (loc) => {
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          this.latestLocation = coords;

          try {
            const addrArray = await Location.reverseGeocodeAsync(coords);
            if (addrArray.length > 0) {
              const addr = addrArray[0];
              this.latestAddress = [addr.name, addr.street, addr.subregion, addr.city, addr.postalCode, addr.region]
                .filter(Boolean)
                .join(", ");
            }
          } catch {}

          // Notify all subscribers
          this.subscribers.forEach((cb) => cb(coords, this.latestAddress));
        }
      );
    }

    if (!this.interval) {
      this.interval = setInterval(async () => {
        if (!this.latestLocation || this.isPosting) return;
        try {
          const userData = await AsyncStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            if (user.role === "employee") {
              this.isPosting = true;
              console.log("📤 Posting location on interval...");
              await postLiveLocation(this.latestLocation.latitude, this.latestLocation.longitude);
              console.log("✅ Location posted successfully");
            }
          }
        } catch (err) {
          console.log("⚠️ Error posting location:", err);
        } finally {
          this.isPosting = false;
        }
      }, 30000);
    }
  }

  public subscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers.push(callback);
    // Immediately send current location
    if (this.latestLocation) callback(this.latestLocation, this.latestAddress);
  }

  public unsubscribe(callback: (coords: Coordinates, address: string) => void) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
}

export default LocationTracker.getInstance();

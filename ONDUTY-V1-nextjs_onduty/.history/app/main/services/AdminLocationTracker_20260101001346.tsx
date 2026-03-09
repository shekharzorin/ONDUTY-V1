import { postAdminAddress } from "@/app/backend-api/api";
import { storage } from "@/app/main/services/storage";

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
     START TRACKING (ONCE PER SESSION)
  ---------------------------------------- */
  public async startTracking() {
    if (typeof window === "undefined") return;
    if (this.hasRunThisSession || this.isPosting) return;

    try {
      // ✅ Use sessionStorage wrapper
      const role = storage.get("userRole");
      if (role !== "admin") return;

      if (!navigator.geolocation) {
        console.warn("⚠️ Geolocation not supported");
        return;
      }

      this.isPosting = true;
      console.log("📍 Requesting admin location");

      /* ---------- Safe geolocation ---------- */
      const position = await new Promise<GeolocationPosition | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      if (!position) return;

      const { latitude, longitude } = position.coords;

      /* ---------- Reverse geocoding ---------- */
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) return;

      const data = await res.json();
      const addr = data?.address;

      const formattedAddress = [
        addr?.house_number,
        addr?.road,
        addr?.suburb || addr?.neighbourhood,
        addr?.city || addr?.town || addr?.village,
        addr?.state,
        addr?.postcode,
        addr?.country,
      ]
        .filter(Boolean)
        .join(", ");

      console.log("📤 Posting admin address:", formattedAddress);

      await postAdminAddress(formattedAddress);

      console.log("✅ Admin location posted successfully");
      this.hasRunThisSession = true;
    } catch (err) {
      console.error("❌ Unexpected AdminLocationTracker error:", err);
    } finally {
      this.isPosting = false;
    }
  }
}

/* ----------------------------------------
   EXPORT SINGLETON INSTANCE
---------------------------------------- */
export default AdminLocationTracker.getInstance();

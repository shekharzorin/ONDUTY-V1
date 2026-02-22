import { postUserStatus } from "@/app/backend-api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

const STATUS_INTERVAL = 30000; // 30 seconds

export default function StatusTracker() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  /* ----------------------------------------
     SEND STATUS TO BACKEND
  ---------------------------------------- */
  const sendStatus = async (status: "active" | "inactive") => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role !== "admin") return; // ✅ ADMIN ONLY

      await postUserStatus(status);
    } catch (err) {
      console.error("❌ StatusTracker error:", err);
    }
  };

  /* ----------------------------------------
     START ACTIVE PING
  ---------------------------------------- */
  const startActivePing = async () => {
    if (intervalRef.current) return;

    await sendStatus("active"); // send immediately

    intervalRef.current = setInterval(() => {
      sendStatus("active");
    }, STATUS_INTERVAL) as any;
  };

  /* ----------------------------------------
     STOP + MARK OFFLINE
  ---------------------------------------- */
  const stopActivePing = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    await sendStatus("inactive");
  };

  /* ----------------------------------------
     APP STATE LISTENER
  ---------------------------------------- */
  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        // 🔥 App opened / resumed
        startActivePing();
      } else if (
        appState.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        // 🔥 App minimized / closed
        stopActivePing();
      }

      appState.current = nextState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // 🚀 First load
    startActivePing();

    return () => {
      subscription.remove();
      stopActivePing();
    };
  }, []);

  return null; // ⛔ No UI
}

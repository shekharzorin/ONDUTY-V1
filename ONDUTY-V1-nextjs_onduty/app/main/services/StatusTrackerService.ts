// StatusTrackerService.ts
import { postUserStatus } from "@/app/backend-api/api";
import { storage } from "@/app/main/services/storage";

const STATUS_INTERVAL = 30000;

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastStatus: "active" | "inactive" | null = null;

/* ----------------------------------------
   INTERNAL: SEND STATUS (GUARDED)
---------------------------------------- */
const sendStatus = async (status: "active" | "inactive") => {
  if (typeof window === "undefined") return;

  // 🛑 Avoid duplicate sends
  if (lastStatus === status) return;

  // 🔐 Guard: must have access token
  const token = storage.get("accessToken");
  if (!token) return;

  // 🔐 Guard: admin only
  const role = storage.get("userRole");
  if (role !== "admin") return;

  try {
    await postUserStatus(status);
    lastStatus = status;
  } catch {
    // silent on purpose (logout / network cases)
  }
};

export const StatusTrackerService = {
  /* ----------------------------------------
     START ACTIVE TRACKING
  ---------------------------------------- */
  start: async () => {
    if (typeof window === "undefined") return;

    // 🔐 Guard: already running
    if (intervalId) return;

    // 🔐 Guard: must be logged in
    const token = storage.get("accessToken");
    if (!token) return;

    // 🔐 Guard: admin only
    const role = storage.get("userRole");
    if (role !== "admin") return;

    await sendStatus("active");

    intervalId = setInterval(() => {
      sendStatus("active");
    }, STATUS_INTERVAL);
  },

  /* ----------------------------------------
     STOP ACTIVE TRACKING (SOFT)
  ---------------------------------------- */
  stop: async () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    await sendStatus("inactive");
  },

  /* ----------------------------------------
     FORCE STOP (LOGOUT / UNMOUNT)
  ---------------------------------------- */
  forceStop: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    lastStatus = null;
  },
};

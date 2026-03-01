"use client";

import { useEffect } from "react";
import { StatusTrackerService } from "./StatusTrackerService";

export default function StatusTracker() {
  useEffect(() => {
    // 🚀 Start tracking when component mounts
    StatusTrackerService.start();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        StatusTrackerService.start();
      } else {
        StatusTrackerService.stop();
      }
    };

    const handleUnload = () => {
      // 🔥 Hard stop on tab close / route change
      StatusTrackerService.forceStop();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
      StatusTrackerService.forceStop();
    };
  }, []);

  return null;
}

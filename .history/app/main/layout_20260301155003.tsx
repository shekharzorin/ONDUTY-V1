"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar/Navbar";
import ProfileModal from "./profile/Profile";
import StatusTracker from "./services/StatusTracker";
import { storage } from "@/app/main/services/storage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = storage.get("accessToken");
    const role = storage.get("userRole");

    if (!token) {
      setAuthorized(false);
      router.replace("/authentication/login");
      return;
    }

    if (role === "admin") {
      setAuthorized(true);
    } else if (role === "user") {
      router.replace("/upgradeplan");
    } else if (role === "employee") {
      router.replace("/accessdenied");
    } else {
      router.replace("/authentication/login");
    }
  }, [router]);

  // ⛔ Render nothing until auth is resolved
  if (authorized !== true) {
    return null;
  }

  return (
    <div className="flex w-full sm:hidden lg:flex">
      {/* 🔥 ADMIN STATUS TRACKER (runs once) */}
      <StatusTracker />

      <Navbar />

      <div className="flex-1 overflow-auto bg-(--color-bg)">
        {children}
      </div>

      {/* PROFILE MODAL */}
      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </div>
  );
}

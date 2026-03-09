"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // 🔁 Redirect on big screens
    if (window.innerWidth > 1023) {
      router.replace("/main/dashboard");
      return;
    } else if (window.innerWidth < 1023) {
      router.replace("/not-supported");
      return;
    }
  }, [router]);

  return null;
}

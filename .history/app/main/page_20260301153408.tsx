"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth > 1023) {
      router.replace("/main/dashboard");
    } else {
      router.replace("/not-supported");
    }
  }, [router]);

  return null;
}

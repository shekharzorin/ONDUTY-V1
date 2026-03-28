"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/app/components/Skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/main/dashboard");
      setLoading(false);
    }, 200); // ⏳ small delay so skeleton is visible

    return () => clearTimeout(timer);
  }, [router]);

  // 🔥 Show skeleton while redirecting
  if (loading) {
    return <Skeleton />;
  }

  return null;
}
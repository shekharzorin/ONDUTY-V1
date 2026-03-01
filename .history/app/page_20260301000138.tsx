"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "./components/Skeleton";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔁 Redirect on big screens
    if (window.innerWidth >= 1024) {
      router.replace("/authentication/login");
      return;
    } else {
      router.replace("/smallscreen");
    }

    setLoading(false);
  }, [router]);

  // 🔥 Skeleton while checking
  if (loading) {
    return <Skeleton />;
  }
}

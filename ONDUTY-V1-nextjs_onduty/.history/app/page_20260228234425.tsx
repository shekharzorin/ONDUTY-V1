"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/app/images/onduty-icon.png";
import Skeleton from "./components/Skeleton";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔁 Redirect on big screens
    if (window.innerWidth >= 768) {
      router.replace("/authentication/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // 🔥 Skeleton while checking
  if (loading) {
    return <Skeleton />;
  }
}

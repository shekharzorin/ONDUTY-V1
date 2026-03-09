"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  // useEffect(() => {
  //   const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;

  //   if (isSmallScreen) {
  //     router.replace("/");
  //   } else {
  //     setAllowed(true);
  //   }
  // }, [router]);

  // ⛔ Block rendering until check completes
  if (!allowed) return null;

  return <>{children}</>;
}
